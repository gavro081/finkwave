package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// this dto is useful when we already have all the necessary info for the song and just need the contribution info
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtistContributionSummaryDto {
    Long id = null;
    private String artistName;
    private String role;

    public ArtistContributionSummaryDto(String artistName, String role) {
        this.artistName = artistName;
        this.role = role;
    }
}
