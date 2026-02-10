package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.PlaylistNotFoundException;
import com.ukim.finki.develop.finkwave.model.Playlist;
import com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDto;
import com.ukim.finki.develop.finkwave.repository.PlaylistRepository;
import com.ukim.finki.develop.finkwave.repository.SavedPlaylistRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;
    private final AuthService authService;
    private final SavedPlaylistRepository savedPlaylistRepository;

    public List<Playlist>findByCreatorId(Long id){
        return playlistRepository.findByCreatorId(id);
    }

    public List<Playlist>findSavedByUser(Long id){
        return savedPlaylistRepository.findSavedPlaylistsMetadata(id);
    }

    public PlaylistDto getPlaylist(Long id){
        Long currentUserId=authService.getCurrentUserIDOptional().orElse(null);
        Playlist playlist = playlistRepository.findById(id).orElseThrow(()-> new PlaylistNotFoundException(id));
        List<MusicalEntityDto>songsInPlaylist=songRepository.findSongsByPlaylistId(id,currentUserId);
        Set<Long> savedIds = savedPlaylistRepository.findAllByListener_Id(currentUserId)
                .stream().map(sp -> sp.getPlaylist().getId()).collect(Collectors.toSet());
        return new PlaylistDto(
                playlist.getId(),
                playlist.getName(),
                playlist.getCover(),
                playlist.getCreatedBy().getNonAdminUser().getUser().getFullName(),
                songsInPlaylist,
                savedIds.contains(playlist.getId())

        );
    }

    public List<BasicPlaylistDto> getBasicPlaylists(){
        Long userId = authService.getCurrentUserID();
        return playlistRepository.getPlaylistsByIdIs(userId);
    }




}
