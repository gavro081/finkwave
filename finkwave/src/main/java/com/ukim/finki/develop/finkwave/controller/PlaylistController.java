package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.AddSongToPlaylistStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.SavePlaylistStatusDto;
import com.ukim.finki.develop.finkwave.service.PlaylistService;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/song/{songId}")
    public HttpEntity<List<Long>>getPlaylistIdsThatContainSong(@PathVariable Long songId){
        return ResponseEntity.ok(playlistService.getPlaylistIdsThatContainSong(songId));
    }

    @PostMapping("/{playlistId}/song/{songId}")
    public HttpEntity<AddSongToPlaylistStatusDto>addSongToPlaylist(@PathVariable Long playlistId,
                                                                   @PathVariable Long songId){
        return ResponseEntity.ok(playlistService.addSongToPlaylist(playlistId,songId));
    }

    @PostMapping
    public ResponseEntity<List<BasicPlaylistDto>> createPlaylist(
            @RequestParam String playlistName,
            @RequestParam(required = false) Long songId
    ) {
        playlistService.createPlaylist(playlistName,songId);

        return ResponseEntity.ok(playlistService.getBasicPlaylists());
    }

    @PostMapping("/{id}/save")
    public HttpEntity<SavePlaylistStatusDto>savePlaylist(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(playlistService.savePlaylist(id));
    }



    @DeleteMapping("/{id}")
    public HttpEntity<Void>deletePlaylist(@PathVariable Long id){
        playlistService.deletePlaylist(id);
        return ResponseEntity.noContent().build();
    }


}
