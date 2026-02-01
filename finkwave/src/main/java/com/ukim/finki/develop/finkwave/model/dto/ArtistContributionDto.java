package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ArtistContributionDto {
    private Long id;
    private String title;
    private String genre;
    private String role;
    private String entityType;
    private Boolean isLikedByCurrentUser;
}
