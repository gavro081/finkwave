package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// this dto is useful when we already have all the necessary info for the song and just need the contribution info
@Getter
@AllArgsConstructor
public class ArtistContributionSummaryDto {
    private String artistName;
    private String role;
}
