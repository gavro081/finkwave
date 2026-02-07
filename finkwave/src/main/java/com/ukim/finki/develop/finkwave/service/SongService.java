package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import com.ukim.finki.develop.finkwave.service.mappers.SongDetailsMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final AuthService authService;
    private final ArtistContributionService artistContributionService;
    private final ReviewService reviewService;
    private final SongDetailsMapper songDetailsMapper;

    public List<MusicalEntityDto> getTopSongs(){
        Long userId = null;
        try {
            userId = authService.getCurrentUserID();
        } catch (Exception ignored) {}
        return songRepository.findTopByListens(userId);
    }

    public List<MusicalEntityDto> searchSongs(String searchTerm){
        Long userId = authService.getCurrentUserID();
        return songRepository.searchSongs(userId, searchTerm);
    }

    public List<BasicSongDto> getRecentlyListened(){
        Long userId = authService.getCurrentUserID();
        return songRepository.getRecentlyListened(userId);
    }

    public MusicalEntityDto getSongById(Long songId){
        Long userId = null;
        try {
            userId = authService.getCurrentUserID();
        } catch (Exception ignored) {}
        return songRepository.getSongById(songId, userId);
    }

    public SongDetailsDto getSongDetails(Long songId){
        Long userId = null;
        try {
            userId = authService.getCurrentUserID();
        } catch (Exception ignored){}
        SongDto songDto = songRepository.getSongById(songId, userId);
        List<ArtistContributionSummaryDto> contributionsBySongId = artistContributionService.getContributionsBySongId(songId);
        List<ReviewDto> reviewsForSongId = reviewService.getReviewsForSongId(songId);
        return songDetailsMapper.toSongDetailsDto(songDto, contributionsBySongId, reviewsForSongId);
    }
}
