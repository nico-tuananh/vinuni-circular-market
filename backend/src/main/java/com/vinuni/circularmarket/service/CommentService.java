package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.CommentDTO;
import com.vinuni.circularmarket.dto.CreateCommentRequest;
import com.vinuni.circularmarket.dto.UserDTO;
import com.vinuni.circularmarket.model.Comment;
import com.vinuni.circularmarket.model.Listing;
import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.repository.CommentRepository;
import com.vinuni.circularmarket.repository.ListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ListingRepository listingRepository;

    public CommentService(CommentRepository commentRepository, ListingRepository listingRepository) {
        this.commentRepository = commentRepository;
        this.listingRepository = listingRepository;
    }

    /**
     * Create a new comment
     * @param userId the user ID
     * @param listingId the listing ID
     * @param request the comment creation request
     * @return created comment DTO
     */
    @Transactional
    public CommentDTO createComment(Long userId, Long listingId, CreateCommentRequest request) {
        // Validate listing exists
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));

        // Create dummy user - in real implementation, this would come from security context
        User user = new User();
        user.setUserId(userId);

        Comment comment;
        if (request.getParentId() != null) {
            // This is a reply - validate parent exists
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found with id: " + request.getParentId()));

            // Ensure parent belongs to the same listing
            if (!parent.getListing().getListingId().equals(listingId)) {
                throw new IllegalArgumentException("Parent comment does not belong to this listing");
            }

            comment = new Comment(listing, user, request.getContent(), parent);
        } else {
            // This is a top-level comment
            comment = new Comment(listing, user, request.getContent());
        }

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    /**
     * Get comments for a listing
     * @param listingId the listing ID
     * @return list of comments for the listing
     */
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByListingId(Long listingId) {
        List<Comment> topLevelComments = commentRepository.findByListing_ListingIdAndParentIsNullOrderByCreatedAtAsc(listingId);

        return topLevelComments.stream()
                .map(this::convertToDTOWithReplies)
                .collect(Collectors.toList());
    }

    /**
     * Get comments for a listing with pagination (top-level only)
     * @param listingId the listing ID
     * @param pageable pagination information
     * @return page of top-level comments
     */
    @Transactional(readOnly = true)
    public Page<CommentDTO> getTopLevelCommentsByListingId(Long listingId, Pageable pageable) {
        return commentRepository.findByListing_ListingIdAndParentIsNullOrderByCreatedAtAsc(listingId, pageable)
                .map(this::convertToDTO);
    }

    /**
     * Get replies to a comment
     * @param parentId the parent comment ID
     * @return list of replies
     */
    @Transactional(readOnly = true)
    public List<CommentDTO> getRepliesByParentId(Long parentId) {
        return commentRepository.findByParent_CommentIdOrderByCreatedAtAsc(parentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get comment by ID
     * @param commentId the comment ID
     * @return optional comment DTO
     */
    @Transactional(readOnly = true)
    public Optional<CommentDTO> getCommentById(Long commentId) {
        return commentRepository.findById(commentId).map(this::convertToDTO);
    }

    /**
     * Update a comment
     * @param commentId the comment ID
     * @param userId the user ID (for authorization)
     * @param newContent the new content
     * @return updated comment DTO
     */
    @Transactional
    public CommentDTO updateComment(Long commentId, Long userId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        // Verify user owns the comment
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to update this comment");
        }

        // Only allow updates within a reasonable time frame (e.g., 15 minutes)
        if (comment.getCreatedAt().isBefore(java.time.LocalDateTime.now().minusMinutes(15))) {
            throw new IllegalArgumentException("Comments can only be edited within 15 minutes of creation");
        }

        comment.setContent(newContent);
        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    /**
     * Delete a comment
     * @param commentId the comment ID
     * @param userId the user ID (for authorization)
     */
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        // Verify user owns the comment
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to delete this comment");
        }

        // If comment has replies, we could either:
        // 1. Prevent deletion
        // 2. Soft delete (mark as deleted but keep in DB)
        // 3. Delete replies too
        // For simplicity, we'll prevent deletion if there are replies
        long replyCount = commentRepository.countByParent_CommentId(commentId);
        if (replyCount > 0) {
            throw new IllegalArgumentException("Cannot delete comment with replies");
        }

        commentRepository.delete(comment);
    }

    /**
     * Admin delete comment (bypasses ownership and reply checks)
     * @param commentId the comment ID
     */
    @Transactional
    public void adminDeleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        // Admin can delete any comment - delete replies first if any
        commentRepository.deleteByParent_CommentId(commentId);

        // Then delete the comment itself
        commentRepository.delete(comment);
    }

    /**
     * Get comments by user
     * @param userId the user ID
     * @return list of comments by the user
     */
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByUserId(Long userId) {
        return commentRepository.findByUser_UserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get comment count for a listing
     * @param listingId the listing ID
     * @return number of comments
     */
    @Transactional(readOnly = true)
    public long getCommentCountForListing(Long listingId) {
        return commentRepository.countByListing_ListingId(listingId);
    }

    /**
     * Convert Comment entity to CommentDTO
     * @param comment the comment entity
     * @return CommentDTO
     */
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setCommentId(comment.getCommentId());
        dto.setListingId(comment.getListing().getListingId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setParentId(comment.getParent() != null ? comment.getParent().getCommentId() : null);

        // Convert user
        if (comment.getUser() != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(comment.getUser().getUserId());
            userDTO.setFullName(comment.getUser().getFullName());
            dto.setUser(userDTO);
        }

        return dto;
    }

    /**
     * Get all comments with pagination for admin moderation
     * @param pageable pagination information
     * @return page of all comments
     */
    @Transactional(readOnly = true)
    public Page<CommentDTO> getAllCommentsPaginated(Pageable pageable) {
        Page<Comment> commentsPage = commentRepository.findAllByOrderByCreatedAtDesc(pageable);
        return commentsPage.map(this::convertToDTO);
    }

    /**
     * Delete comment as admin (bypasses ownership checks)
     * @param commentId the comment ID
     */
    @Transactional
    public void deleteCommentAsAdmin(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        // If comment has replies, delete them too (cascade)
        List<Comment> replies = commentRepository.findByParent_CommentIdOrderByCreatedAtAsc(commentId);
        if (!replies.isEmpty()) {
            commentRepository.deleteAll(replies);
        }

        commentRepository.delete(comment);
    }

    /**
     * Bulk delete comments as admin
     * @param commentIds list of comment IDs to delete
     * @return number of comments deleted
     */
    @Transactional
    public int bulkDeleteComments(List<Long> commentIds) {
        int deletedCount = 0;
        for (Long commentId : commentIds) {
            try {
                deleteCommentAsAdmin(commentId);
                deletedCount++;
            } catch (Exception e) {
                // Log error but continue with other deletions
                System.err.println("Failed to delete comment " + commentId + ": " + e.getMessage());
            }
        }
        return deletedCount;
    }

    /**
     * Convert Comment entity to CommentDTO with replies
     * @param comment the comment entity
     * @return CommentDTO with replies
     */
    private CommentDTO convertToDTOWithReplies(Comment comment) {
        CommentDTO dto = convertToDTO(comment);

        // Load replies
        List<CommentDTO> replies = commentRepository.findByParent_CommentIdOrderByCreatedAtAsc(comment.getCommentId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        dto.setReplies(replies);
        return dto;
    }
}