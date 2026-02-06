package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.BasicSongDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import com.ukim.finki.develop.finkwave.service.AuthService;
import com.ukim.finki.develop.finkwave.service.SongService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/songs")
@AllArgsConstructor
public class SongController {
    private final AuthService authService;
    private final SongService songService;

    @GetMapping("/top")
    public HttpEntity<List<MusicalEntityDto>> getSongs(){
        Long userId = authService.getCurrentUserID();
        return ResponseEntity.ok(songService.getTopSongs(userId));
    }

    @GetMapping("/search")
    public HttpEntity<List<MusicalEntityDto>> searchSongs(
            @RequestParam(name = "q") String searchTerm){
        return ResponseEntity.ok(songService.searchSongs(searchTerm));
    }

    @GetMapping("/recent")
    public HttpEntity<List<BasicSongDto>> getRecentlyListenedSongs(){
        return ResponseEntity.ok(songService.getRecentlyListened());
    }
}
