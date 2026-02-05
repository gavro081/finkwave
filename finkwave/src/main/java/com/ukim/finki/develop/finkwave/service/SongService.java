package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SongService {
    private final SongRepository songRepository;

    public List<MusicalEntityDto> getTopSongs(Long userId){
        return songRepository.findTopByListens(userId);
    }
}
