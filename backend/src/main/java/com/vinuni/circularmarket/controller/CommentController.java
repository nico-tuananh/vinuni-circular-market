package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.CommentDTO;
import com.vinuni.circularmarket.dto.CreateCommentRequest;
import com.vinuni.circularmarket.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010"})
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Get comments for a listing (public endpoint)
     * @param listingId the listing ID
     * @return list of comments for the listing
     */
    @GetMapping("/listings/{listingId}")
    public ResponseEntity<?> getCommentsByListingId(@PathVariable Long listingId) {
        try {
            List<CommentDTO> comments = commentService.getCommentsByListingId(listingId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve comments");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get top-level comments for a listing with pagination (public endpoint)
     * @param listingId the listing ID
     * @param page page number
     * @param size page size
     * @return paginated top-level comments
     */
    @GetMapping("/listings/{listingId}/top-level")
    public ResponseEntity<?> getTopLevelCommentsByListingId(
            @PathVariable Long listingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CommentDTO> commentsPage = commentService.getTopLevelCommentsByListingId(listingId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("comments", commentsPage.getContent());
            response.put("currentPage", commentsPage.getNumber());
            response.put("totalItems", commentsPage.getTotalElements());
            response.put("totalPages", commentsPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve comments");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get replies to a comment (public endpoint)
     * @param parentId the parent comment ID
     * @return list of replies
     */
    @GetMapping("/{parentId}/replies")
    public ResponseEntity<?> getRepliesByParentId(@PathVariable Long parentId) {
        try {
            List<CommentDTO> replies = commentService.getRepliesByParentId(parentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve replies");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Create a new comment (authenticated endpoint)
     * @param listingId the listing ID
     * @param request the comment creation request
     * @return created comment or error
     */
    @PostMapping("/listings/{listingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createComment(@PathVariable Long listingId, @Valid @RequestBody CreateCommentRequest request) {
        try {
            Long userId = getCurrentUserId();
            CommentDTO createdComment = commentService.createComment(userId, listingId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update a comment (authenticated endpoint - owner only)
     * @param commentId the comment ID
     * @param request the updated comment content
     * @return updated comment or error
     */
    @PutMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestBody Map<String, String> request) {
        try {
            String newContent = request.get("content");
            if (newContent == null || newContent.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Content is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Long userId = getCurrentUserId();
            CommentDTO updatedComment = commentService.updateComment(commentId, userId, newContent.trim());
            return ResponseEntity.ok(updatedComment);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete a comment (authenticated endpoint - owner only)
     * @param commentId the comment ID
     * @return success message or error
     */
    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            Long userId = getCurrentUserId();
            commentService.deleteComment(commentId, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get comment count for a listing (public endpoint)
     * @param listingId the listing ID
     * @return comment count
     */
    @GetMapping("/listings/{listingId}/count")
    public ResponseEntity<?> getCommentCountForListing(@PathVariable Long listingId) {
        try {
            long count = commentService.getCommentCountForListing(listingId);
            Map<String, Object> response = new HashMap<>();
            response.put("listingId", listingId);
            response.put("commentCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to get comment count");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to delete any comment (moderation)
     * @param commentId the comment ID
     * @return success message or error
     */
    @DeleteMapping("/{commentId}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDeleteComment(@PathVariable Long commentId) {
        try {
            // For admin deletion, we bypass ownership checks
            // First check if comment exists
            if (!commentService.getCommentById(commentId).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Comment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // Admin can delete any comment, even with replies
            commentService.adminDeleteComment(commentId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment deleted by admin successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to get all comments with pagination (for moderation)
     * @param page page number
     * @param size page size
     * @return paginated comments for moderation
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCommentsForModeration(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CommentDTO> commentsPage = commentService.getAllCommentsPaginated(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("comments", commentsPage.getContent());
            response.put("currentPage", commentsPage.getNumber());
            response.put("totalItems", commentsPage.getTotalElements());
            response.put("totalPages", commentsPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve comments for moderation");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to delete any comment (moderation)
     * @param commentId the comment ID
     * @return success message or error
     */
    @DeleteMapping("/admin/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCommentAsAdmin(@PathVariable Long commentId) {
        try {
            commentService.deleteCommentAsAdmin(commentId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment deleted successfully by admin");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to bulk delete comments
     * @param commentIds list of comment IDs to delete
     * @return success message with count of deleted comments
     */
    @DeleteMapping("/admin/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkDeleteComments(@RequestBody Map<String, List<Long>> requestBody) {
        try {
            List<Long> commentIds = requestBody.get("commentIds");
            if (commentIds == null || commentIds.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Comment IDs are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            int deletedCount = commentService.bulkDeleteComments(commentIds);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk delete completed");
            response.put("deletedCount", deletedCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to perform bulk delete");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Helper method to get current user ID from security context
     * In real implementation, this would extract user ID from JWT token
     */
    private Long getCurrentUserId() {
        // Placeholder - in real implementation, extract from JWT token
        return 1L; // Placeholder
    }
}