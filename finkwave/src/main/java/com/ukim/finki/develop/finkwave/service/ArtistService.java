package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDto;
import com.ukim.finki.develop.finkwave.repository.ArtistContributionRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ArtistService {

    private final ArtistContributionRepository artistContributionRepository;


    @Transactional(readOnly=true)
    public List<ArtistContributionDto> getArtistContributions(Long artistId){
        return artistContributionRepository.findContributionsByArtistId(artistId);
    }

}
