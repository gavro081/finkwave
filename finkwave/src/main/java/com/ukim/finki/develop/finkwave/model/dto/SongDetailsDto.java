package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SongDetailsDto extends SongDto{
    private List<ArtistContributionSummaryDto> contributions;
    private List<ReviewDto> reviews;
}
