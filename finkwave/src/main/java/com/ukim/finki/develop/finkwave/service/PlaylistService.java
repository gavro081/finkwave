package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.PlaylistNotFoundException;
import com.ukim.finki.develop.finkwave.model.Playlist;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDto;
import com.ukim.finki.develop.finkwave.repository.PlaylistRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;
    private final AuthService authService;

    public List<Playlist>findByCreatorId(Long id){
        return playlistRepository.findByCreatorId(id);
    }

    public PlaylistDto getPlaylist(Long id){
        Long currentUserId=authService.getCurrentUserID();
        Playlist playlist = playlistRepository.findById(id).orElseThrow(()-> new PlaylistNotFoundException(id));
        List<MusicalEntityDto>songsInPlaylist=songRepository.findSongsByPlaylistId(id,currentUserId);
        return new PlaylistDto(
                playlist.getId(),
                playlist.getName(),
                playlist.getCover(),
                playlist.getCreatedBy().getNonAdminUser().getUser().getFullName(),
                songsInPlaylist
        );
    }



}
