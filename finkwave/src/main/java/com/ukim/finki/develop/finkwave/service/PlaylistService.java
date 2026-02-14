package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.MusicalEntityNotFoundException;
import com.ukim.finki.develop.finkwave.exceptions.PlaylistNotFoundException;
import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.*;
import com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDto;
import com.ukim.finki.develop.finkwave.model.dto.SongWithLinkDto;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.AddSongToPlaylistStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.SavePlaylistStatusDto;
import com.ukim.finki.develop.finkwave.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;
    private final AuthService authService;
    private final SavedPlaylistRepository savedPlaylistRepository;
    private final ListenerRepository listenerRepository;
    private final PlaylistSongRepository playlistSongRepository;

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

    public List<Long>getPlaylistIdsThatContainSong(Long songId){

        Long currentUserId=authService.getCurrentUserIDOptional().orElse(null);
        return playlistSongRepository.getPlaylistsIdsWithSong(songId,currentUserId);

    }


    public AddSongToPlaylistStatusDto addSongToPlaylist(Long playlistId, Long songId){
        Playlist playlist=playlistRepository.findById(playlistId).orElseThrow(()->new PlaylistNotFoundException(playlistId));
        Long currentUserId=authService.getCurrentUserID();
        if (!Objects.equals(playlist.getCreatedBy().getId(), currentUserId)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cannot add songs to playlists NOT created by the current user!");
        }
        PlaylistSongId playlistSongId=new PlaylistSongId(songId,playlistId);

        boolean isSongAddedToPlaylist;

        if (playlistSongRepository.existsById(playlistSongId)){
            playlistSongRepository.deleteById(playlistSongId);
            isSongAddedToPlaylist=false;
        }else {
            Song song=songRepository.findById(songId).orElseThrow(
                    ()->new MusicalEntityNotFoundException(String.format("Cannot find song with id %d.", songId)));

            playlistSongRepository.save(new PlaylistSong(playlistSongId,song,playlist));
            isSongAddedToPlaylist=true;
        }
        return new AddSongToPlaylistStatusDto(playlistId,isSongAddedToPlaylist);

    }



}
