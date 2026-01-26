package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ArtistContributionDTO {
    private String role;
    private Long musicalEntityId;
    private String title;
    private String entityType;
}
