package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.LikeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    public List<MusicalEntityDto> findLikedEntitiesWithTypeByListenerId(Long listenerId){
        return likeRepository.findLikedEntitiesWithTypeByListenerId(listenerId);
    }
}
