package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.Playlist;
import com.ukim.finki.develop.finkwave.model.dto.ListenerLikesDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.LikeRepository;
import com.ukim.finki.develop.finkwave.repository.PlaylistRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class ListenerService {
    private final LikeService likeService;
    private final PlaylistService playlistService;

    public List<MusicalEntityDto> getLikedEntities(Long currentUserId,Long listenerId) {
        return  likeService.findLikedEntitiesWithTypeByListenerId(currentUserId,listenerId);


    }


    public List<Playlist>getPlaylistsCreatedByUser(Long listenerId){
        return playlistService.findByCreatorId(listenerId);
    }

    public List<Playlist>getPlaylistsSavedByUser(Long listenerId){
        return playlistService.findSavedByUser(listenerId);
    }
}


