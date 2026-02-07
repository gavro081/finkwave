package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.ReviewDto;
import com.ukim.finki.develop.finkwave.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<ReviewDto> getReviewsForSongId(Long songId){
        return reviewRepository.getReviewsForSongId(songId);
    }
}
