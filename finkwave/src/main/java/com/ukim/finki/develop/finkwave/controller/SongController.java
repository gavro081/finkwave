package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import com.ukim.finki.develop.finkwave.service.AuthService;
import com.ukim.finki.develop.finkwave.service.SongService;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs")
@AllArgsConstructor
public class SongController {
    private final SongService songService;

    @GetMapping("/top")
    public HttpEntity<List<SongDto>> getSongs(){
        return ResponseEntity.ok(songService.getTopSongs());
    }

    @GetMapping("/search")
    public HttpEntity<List<SongDto>> searchSongs(
            @RequestParam(name = "q") String searchTerm){
        return ResponseEntity.ok(songService.searchSongs(searchTerm));
    }

    @GetMapping("/recent")
    public HttpEntity<List<BasicSongDto>> getRecentlyListenedSongs(){
        return ResponseEntity.ok(songService.getRecentlyListened());
    }

    @GetMapping("/{songId}/details")
    public HttpEntity<SongDetailsDto> getSongById(@PathVariable Long songId){
        return ResponseEntity.ok(songService.getSongDetails(songId));
    }

    @GetMapping("/catalog")
    public HttpEntity<List<MusicalEntitesByArtistDto>> getArtistCatalog(){
        List<MusicalEntitesByArtistDto> artistCatalog = songService.getArtistCatalog();
        return ResponseEntity.ok(artistCatalog);
    }
}
