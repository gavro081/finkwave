package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDTO;
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
    public List<ArtistContributionDTO> getArtistContributions(Long artistId){
        List<Object[]>results=artistContributionRepository.findContributionsByArtistId(artistId);

        return results.stream()
        .map(row->new ArtistContributionDTO((Long)row[0], (String)row[1], (String)row[2],(String)row[3], (String)row[4]))
        .collect(Collectors.toList());
    }

}
