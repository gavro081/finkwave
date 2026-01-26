package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.Song;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDTO;
import com.ukim.finki.develop.finkwave.model.dto.ArtistMusicalEntitiesDTO;
import com.ukim.finki.develop.finkwave.repository.ArtistContributionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ArtistService {

    private final MusicalEntityService musicalEntityService;
    private final ArtistContributionRepository contributionRepository;


    public List<ArtistContributionDTO> getArtistContributions(Long id){

        ArtistMusicalEntitiesDTO artistMusicalEntities=musicalEntityService.getArtistMusicalEntities(id);
        List<ArtistContribution>contributions=contributionRepository.findAllByArtist_Id(id);
        return contributions.stream().map(c -> {
            boolean isSong = artistMusicalEntities.getSongs().stream()
                    .anyMatch(s -> s.getId().equals(c.getMusicalEntity().getId()));

            return new ArtistContributionDTO(
                    c.getRole(),
                    c.getMusicalEntity().getId(),
                    c.getMusicalEntity().getTitle(),
                    isSong ? "Song" : "Album"
            );
        }).collect(Collectors.toList());
    }

}
