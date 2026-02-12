package com.ukim.finki.develop.finkwave.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumSongsDto {
    private String title;
    private String link;
    private List<ArtistContributionSummaryDto> contributors;
}
