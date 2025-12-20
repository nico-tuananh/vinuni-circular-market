package com.vinuni.circularmarket.repository;

import com.vinuni.circularmarket.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Find comments by listing ID
     * @param listingId the listing ID
     * @return list of comments for the listing
     */
    List<Comment> findByListing_ListingId(Long listingId);

    /**
     * Find comments by listing ID with pagination
     * @param listingId the listing ID
     * @param pageable pagination information
     * @return page of comments for the listing
     */
    Page<Comment> findByListing_ListingIdOrderByCreatedAtAsc(Long listingId, Pageable pageable);

    /**
     * Find top-level comments by listing ID (comments without parent)
     * @param listingId the listing ID
     * @return list of top-level comments for the listing
     */
    List<Comment> findByListing_ListingIdAndParentIsNullOrderByCreatedAtAsc(Long listingId);

    /**
     * Find top-level comments by listing ID with pagination
     * @param listingId the listing ID
     * @param pageable pagination information
     * @return page of top-level comments for the listing
     */
    Page<Comment> findByListing_ListingIdAndParentIsNullOrderByCreatedAtAsc(Long listingId, Pageable pageable);

    /**
     * Find replies to a comment
     * @param parentId the parent comment ID
     * @return list of replies to the comment
     */
    List<Comment> findByParent_CommentIdOrderByCreatedAtAsc(Long parentId);

    /**
     * Find comments by user ID
     * @param userId the user ID
     * @return list of comments by the user
     */
    List<Comment> findByUser_UserId(Long userId);

    /**
     * Find comments by user ID with pagination
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of comments by the user
     */
    Page<Comment> findByUser_UserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Count comments for a listing
     * @param listingId the listing ID
     * @return number of comments for the listing
     */
    long countByListing_ListingId(Long listingId);

    /**
     * Count top-level comments for a listing
     * @param listingId the listing ID
     * @return number of top-level comments for the listing
     */
    long countByListing_ListingIdAndParentIsNull(Long listingId);

    /**
     * Count replies to a comment
     * @param parentId the parent comment ID
     * @return number of replies to the comment
     */
    long countByParent_CommentId(Long parentId);

    /**
     * Count comments by user
     * @param userId the user ID
     * @return number of comments by the user
     */
    long countByUser_UserId(Long userId);

    /**
     * Find comment thread (comment and all its replies recursively)
     * @param rootCommentId the root comment ID
     * @return list containing the root comment and all its nested replies
     */
    @Query("SELECT c FROM Comment c WHERE c.commentId = :rootCommentId OR c.parent.commentId = :rootCommentId OR EXISTS (SELECT 1 FROM Comment c2 WHERE c2.parent.commentId = :rootCommentId AND c.parent.commentId = c2.commentId) ORDER BY c.createdAt ASC")
    List<Comment> findCommentThread(@Param("rootCommentId") Long rootCommentId);

    /**
     * Find recent comments across all listings
     * @param pageable pagination information
     * @return page of recent comments
     */
    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Find comments by listing and user (for checking if user already commented)
     * @param listingId the listing ID
     * @param userId the user ID
     * @return list of comments by user on the listing
     */
    List<Comment> findByListing_ListingIdAndUser_UserId(Long listingId, Long userId);

    /**
     * Delete all replies to a comment (for cascade delete)
     * @param parentId the parent comment ID
     */
    void deleteByParent_CommentId(Long parentId);
}