package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.BasicSongDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final AuthService authService;

    public List<MusicalEntityDto> getTopSongs(Long userId){
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
}
