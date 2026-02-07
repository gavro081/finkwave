package com.ukim.finki.develop.finkwave.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SongDetailsDto extends SongDto{
    private List<ArtistContributionSummaryDto> contributions;
    private List<ReviewDto> reviews;

    public SongDetailsDto(Long id, String title, String genre, String type, String releasedBy, String cover, Boolean isLikedByCurrentUser, String album, String link, List<ArtistContributionSummaryDto> contributions, List<ReviewDto> reviews) {
        super(id, title, genre, type, releasedBy, cover, isLikedByCurrentUser, album, link);
        this.contributions = contributions;
        this.reviews = reviews;
    }

    public SongDetailsDto(Long id, String title, String genre, String type, String releasedBy, Boolean isLikedByCurrentUser, String link, List<ArtistContributionSummaryDto> contributions, List<ReviewDto> reviews) {
        super(id, title, genre, type, releasedBy, isLikedByCurrentUser, link);
        this.contributions = contributions;
        this.reviews = reviews;
    }

    public SongDetailsDto(Long id, String title, String genre, String type, String releasedBy, String cover, Boolean isLikedByCurrentUser, String link, List<ArtistContributionSummaryDto> contributions, List<ReviewDto> reviews) {
        super(id, title, genre, type, releasedBy, cover, isLikedByCurrentUser, link);
        this.contributions = contributions;
        this.reviews = reviews;
    }

}
