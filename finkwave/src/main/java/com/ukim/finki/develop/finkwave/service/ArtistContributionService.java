package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionSummaryDto;
import com.ukim.finki.develop.finkwave.repository.ArtistContributionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistContributionService {
    private final ArtistContributionRepository artistContributionRepository;

    public List<ArtistContributionSummaryDto> getContributionsBySongId(Long songId){
        return artistContributionRepository.findContributionsBySongId(songId);
    }
}
