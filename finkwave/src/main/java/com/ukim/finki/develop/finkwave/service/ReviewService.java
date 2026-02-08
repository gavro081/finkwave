package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Listener;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.Review;
import com.ukim.finki.develop.finkwave.model.ReviewId;
import com.ukim.finki.develop.finkwave.model.dto.ReviewDto;
import com.ukim.finki.develop.finkwave.model.dto.ReviewPostDto;
import com.ukim.finki.develop.finkwave.repository.ListenerRepository;
import com.ukim.finki.develop.finkwave.repository.MusicalEntityRepository;
import com.ukim.finki.develop.finkwave.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final AuthService authService;
    private final ListenerRepository listenerRepository;
    private final MusicalEntityRepository musicalEntityRepository;

    public List<ReviewDto> getReviewsForSongId(Long songId){
        return reviewRepository.getReviewsForSongId(songId);
    }

    public void createReview(Long songId, ReviewPostDto reviewPostDto){
        Long userId = authService.getCurrentUserID();

        // todo: custom exceptions
        Listener listener = listenerRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        MusicalEntity musicalEntity = musicalEntityRepository
                .findById(songId)
                .orElseThrow();

        // show proper error for doubled reviews from user

        Review review = new Review();
        review.setId(new ReviewId());
        review.setListener(listener);
        review.setMusicalEntity(musicalEntity);
        review.setComment(reviewPostDto.getComment());
        review.setGrade(reviewPostDto.getGrade());

        reviewRepository.save(review);
    }

    public void deleteReview(Long songId){
        Long userId = authService.getCurrentUserID();
        Review review = reviewRepository.getReviewById_ListenerIdAndId_MusicalEntityId(userId, songId);

        reviewRepository.delete(review);
    }
}
