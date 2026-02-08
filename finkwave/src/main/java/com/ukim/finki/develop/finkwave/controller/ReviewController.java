package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.ReviewPostDto;
import com.ukim.finki.develop.finkwave.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reviews")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{songId}")
    public HttpEntity<Map<String, String>> postReview(@PathVariable Long songId,
                                                      @RequestBody ReviewPostDto reviewPostDto){
        reviewService.createReview(songId, reviewPostDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{songId}")
    public HttpEntity<Void> deleteReview(@PathVariable Long songId){
        reviewService.deleteReview(songId);
        return ResponseEntity.noContent().build();
    }
}
