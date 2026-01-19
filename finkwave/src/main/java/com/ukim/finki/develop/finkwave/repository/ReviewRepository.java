package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Review;
import com.ukim.finki.develop.finkwave.model.ReviewId;

@Repository
public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
}
