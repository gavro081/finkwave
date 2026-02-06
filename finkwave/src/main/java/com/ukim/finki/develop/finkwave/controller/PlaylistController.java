package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDto;
import com.ukim.finki.develop.finkwave.service.PlaylistService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/playlists")
public class PlaylistController {
    private final PlaylistService playlistService;

    @GetMapping("/{id}")
    public HttpEntity<PlaylistDto> getPlaylist(@PathVariable Long id){
        return ResponseEntity.ok(playlistService.getPlaylist(id));
    }

    @GetMapping("/user")
    public HttpEntity<List<BasicPlaylistDto>> getUserBasicPlaylists(){
        return ResponseEntity.ok(playlistService.getBasicPlaylists());
    }

}
