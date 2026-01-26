package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.Playlist;
import com.ukim.finki.develop.finkwave.model.dto.ListenerLikesDTO;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDTO;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDTO;
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
    public ListenerLikesDTO getLikedEntities(Long listenerId) {
        List<Object[]> results = likeRepository.findLikedEntitiesWithTypeByListenerId(listenerId);

        List<MusicalEntityDTO>likedEntities=results.stream()
        .map(row->new MusicalEntityDTO((Long)row[0], (String)row[1], (String)row[2],(String)row[3]))
        .toList();
        
        ListenerLikesDTO dto=new ListenerLikesDTO();
        dto.setLikedEntities(likedEntities);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<Playlist>getPlaylistsCreatedByUser(Long listenerId){
        return playlistRepository.findByCreatorId(listenerId);
    }
}


