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

    public SongDetailsDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, String cover, Boolean isLikedByCurrentUser, String album, Long albumId, String link, List<ReviewDto> reviews, List<ArtistContributionSummaryDto> contributions) {
        super(id, title, genre, type, releasedBy, artistUsername, cover, isLikedByCurrentUser, album, albumId, link);
        this.reviews = reviews;
        this.contributions = contributions;
    }

    public SongDetailsDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, Boolean isLikedByCurrentUser, String link, List<ReviewDto> reviews, List<ArtistContributionSummaryDto> contributions) {
        super(id, title, genre, type, releasedBy, artistUsername, isLikedByCurrentUser, link);
        this.reviews = reviews;
        this.contributions = contributions;
    }

    public SongDetailsDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, String cover, Boolean isLikedByCurrentUser, String link, List<ReviewDto> reviews, List<ArtistContributionSummaryDto> contributions) {
        super(id, title, genre, type, releasedBy, artistUsername, cover, isLikedByCurrentUser, link);
        this.reviews = reviews;
        this.contributions = contributions;
    }
}
