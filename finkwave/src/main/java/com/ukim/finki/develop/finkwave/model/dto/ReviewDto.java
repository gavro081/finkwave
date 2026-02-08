package com.ukim.finki.develop.finkwave.model.dto;

import com.ukim.finki.develop.finkwave.model.ReviewId;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewDto {
    private ReviewId id;
    private String author;
    private String authorUsername;
    private Integer grade;
    private String comment;
}
