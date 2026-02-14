package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.PlaylistNotFoundException;
import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Listener;
import com.ukim.finki.develop.finkwave.model.Playlist;
import com.ukim.finki.develop.finkwave.model.SavedPlaylist;
import com.ukim.finki.develop.finkwave.model.SavedPlaylistId;
import com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.SongWithLinkDto;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.SavePlaylistStatusDto;
import com.ukim.finki.develop.finkwave.repository.ListenerRepository;
import com.ukim.finki.develop.finkwave.repository.PlaylistRepository;
import com.ukim.finki.develop.finkwave.repository.SavedPlaylistRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;
    private final AuthService authService;
    private final SavedPlaylistRepository savedPlaylistRepository;
    private final ListenerRepository listenerRepository;

    public List<Playlist>findByCreatorId(Long id){
        return playlistRepository.findByCreatorId(id);
    }

    public List<Playlist>findSavedByUser(Long id){
        return savedPlaylistRepository.findSavedPlaylistsMetadata(id);
    }

    public PlaylistDto getPlaylist(Long id){
        Long currentUserId=authService.getCurrentUserIDOptional().orElse(null);
        Playlist playlist = playlistRepository.findById(id).orElseThrow(()-> new PlaylistNotFoundException(id));
        List<SongWithLinkDto>songsInPlaylist=songRepository.findSongsByPlaylistId(id,currentUserId);
        Set<Long> savedIds = savedPlaylistRepository.findAllByListener_Id(currentUserId)
                .stream().map(sp -> sp.getPlaylist().getId()).collect(Collectors.toSet());
        return new PlaylistDto(
                playlist.getId(),
                playlist.getName(),
                playlist.getCover(),
                playlist.getCreatedBy().getNonAdminUser().getUser().getFullName(),
                playlist.getCreatedBy().getNonAdminUser().getUser().getUsername(),
                songsInPlaylist,
                savedIds.contains(playlist.getId())

        );
    }

    public List<BasicPlaylistDto> getBasicPlaylists(){
        Long userId = authService.getCurrentUserIDOptional().orElse(null);
        return playlistRepository.getPlaylistsByIdIs(userId);
    }

    @Transactional
    public SavePlaylistStatusDto savePlaylist(Long playlistId) throws Exception {
        Long currentUserId=authService.getCurrentUserID();
        SavedPlaylistId savedPlaylistId=new SavedPlaylistId(currentUserId,playlistId);
        Playlist playlist=playlistRepository.findById(playlistId).orElseThrow(
                ()->new PlaylistNotFoundException(playlistId)
        );
        if (playlist.getCreatedBy().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cannot save playlist created by the current user!");
        }



        boolean isSaved;

        if (savedPlaylistRepository.existsById(savedPlaylistId)){
            savedPlaylistRepository.deleteById(savedPlaylistId);
            isSaved=false;
        }
        else{
            Listener listener=listenerRepository.findById(currentUserId).orElseThrow(
                    ()->new UserNotFoundException("Listener not found")
            );

            savedPlaylistRepository.save(new SavedPlaylist(listener,playlist));
            isSaved=true;
        }
        return new SavePlaylistStatusDto(playlistId,isSaved);

    }



}
