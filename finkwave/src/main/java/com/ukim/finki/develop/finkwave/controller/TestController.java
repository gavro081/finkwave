package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.SongDto;
import com.ukim.finki.develop.finkwave.model.dto.UserSearchResultDto;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import com.ukim.finki.develop.finkwave.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/test")
public class TestController {
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    @GetMapping("/search/{searchTerm}")
    public HttpEntity<List<SongDto>> searchSongsTest(@PathVariable String searchTerm){
        return ResponseEntity.ok(songRepository.searchSongs(null, searchTerm));
    }

    @GetMapping("/search/u/{searchTerm}")
    public HttpEntity<List<UserSearchResultDto>> searchUsersTest(@PathVariable String searchTerm){
        return ResponseEntity.ok(userRepository.searchListeners(searchTerm, 10));
    }
    @GetMapping("/search/a/{searchTerm}")
    public HttpEntity<List<UserSearchResultDto>> searchArtistsTest(@PathVariable String searchTerm){
        return ResponseEntity.ok(userRepository.searchArtists(searchTerm, 10));
    }
}
