package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.dto.ReviewDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Review;
import com.ukim.finki.develop.finkwave.model.ReviewId;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
    @Query("""
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.ReviewDto(
        r.id,
        r.listener.nonAdminUser.user.fullName,
        r.grade,
        r.comment
        )
        FROM Review r
        WHERE r.id.musicalEntityId = :songId
    """)
    List<ReviewDto> getReviewsForSongId(@Param("songId") Long songId);
}
