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
public class ListenerService {
    private final LikeRepository likeRepository;
    private final PlaylistRepository playlistRepository;
    @Transactional(readOnly = true)
    public List<MusicalEntityDto> getLikedEntities(Long listenerId) {
        return  likeRepository.findLikedEntitiesWithTypeByListenerId(listenerId);


    }

    @Transactional(readOnly = true)
    public List<Playlist>getPlaylistsCreatedByUser(Long listenerId){
        return playlistRepository.findByCreatorId(listenerId);
    }
}


