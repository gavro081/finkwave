package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.Album;
import com.ukim.finki.develop.finkwave.model.Like;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.Song;
import com.ukim.finki.develop.finkwave.model.dto.ArtistMusicalEntitiesDTO;
import com.ukim.finki.develop.finkwave.model.dto.ListenerLikesDTO;
import com.ukim.finki.develop.finkwave.repository.AlbumRepository;
import com.ukim.finki.develop.finkwave.repository.LikeRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ListenerService {
    private final LikeRepository likeRepository;
    private final MusicalEntityService musicalEntityService;

    public List<ListenerLikesDTO>getLikedEntities(Long listenerId){
        List<Like>likes=likeRepository.getLikesByListener_Id(listenerId);


        return likes.stream().map(l -> new ListenerLikesDTO(
                l.getMusicalEntity().getId(),
                l.getMusicalEntity().getTitle(),
                l.getMusicalEntity().getGenre(),
                musicalEntityService.getEntityType(l.getMusicalEntity().getId())
        )).toList();
    }


}
