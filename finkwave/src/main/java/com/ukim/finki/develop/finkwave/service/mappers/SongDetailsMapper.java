package com.ukim.finki.develop.finkwave.service.mappers;

import com.ukim.finki.develop.finkwave.model.dto.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SongDetailsMapper {
    public SongDetailsDto toSongDetailsDto(SongDto songDto,
                                           List<ArtistContributionSummaryDto> artistContributionSummaryDtos,
                                           List<ReviewDto> reviewDtos){
        SongDetailsDto songDetailsDto = new SongDetailsDto();
        songDetailsDto.setId(songDto.getId());
        songDetailsDto.setTitle(songDto.getTitle());
        songDetailsDto.setAlbum(songDto.getAlbum());
        songDetailsDto.setCover(songDto.getCover());
        songDetailsDto.setGenre(songDto.getGenre());
        songDetailsDto.setType(songDto.getType());
        songDetailsDto.setAlbum(songDto.getAlbum());
        songDetailsDto.setLink(songDto.getLink());
        songDetailsDto.setIsLikedByCurrentUser(songDto.getIsLikedByCurrentUser());
        songDetailsDto.setReleasedBy(songDto.getReleasedBy());
        songDetailsDto.setContributions(artistContributionSummaryDtos);
        songDetailsDto.setReviews(reviewDtos);
        return songDetailsDto;
    }
}
