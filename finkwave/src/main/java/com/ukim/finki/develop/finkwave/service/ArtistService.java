package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Artist;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDto;
import com.ukim.finki.develop.finkwave.repository.ArtistContributionRepository;

import com.ukim.finki.develop.finkwave.repository.ArtistRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ArtistService {
    private final ArtistContributionRepository artistContributionRepository;
    private final ArtistRepository artistRepository;


    @Transactional(readOnly=true)
    public List<ArtistContributionDto> getArtistContributions(Long artistId, Long currentUserId){
        return artistContributionRepository.findContributionsByArtistId(currentUserId,artistId);
    }

    public Artist getArtistById(Long id){
        return artistRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

}
