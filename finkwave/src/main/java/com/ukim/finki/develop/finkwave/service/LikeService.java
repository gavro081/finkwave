package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.MusicalEntityNotFoundException;
import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Like;
import com.ukim.finki.develop.finkwave.model.LikeId;
import com.ukim.finki.develop.finkwave.model.Listener;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.dto.LikeStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final AuthService authService;
    private final MusicalEntityRepository musicalEntityRepository;
    private AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final ListenerRepository listenerRepository;

    public List<MusicalEntityDto> findLikedEntitiesWithTypeByListenerId(Long currentUserId,Long listenerId){
        return likeRepository.findLikedEntitiesWithTypeByListenerId(currentUserId,listenerId);
    }

    public LikeStatusDto toggleLike(Long entityId){
        Long currentUserId=authService.getCurrentUserID();


        LikeId likeId=new LikeId(currentUserId,entityId);
        boolean isLiked;
        if (likeRepository.existsById(likeId)){
            likeRepository.deleteById(likeId);
            isLiked=false;
        }
        else{
            Listener listener=listenerRepository.findById(currentUserId).orElseThrow(
                    ()->new UserNotFoundException("Listener not found")
            );
            MusicalEntity entity=musicalEntityRepository.findById(entityId).orElseThrow(
                    ()->new MusicalEntityNotFoundException("Entity not found")
            );
            likeRepository.save(new Like(entity,listener));
            isLiked=true;
        }
        return new LikeStatusDto(entityId,isLiked,determineType(entityId));

    }

    private String determineType(Long id){
        if (albumRepository.existsById(id)){
            return "ALBUM";
        }else if(songRepository.existsById(id)){
            return "SONG";
        }return "UNDEFINED";
    }

}
