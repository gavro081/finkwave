package com.ukim.finki.develop.finkwave.model.dto;

import com.ukim.finki.develop.finkwave.model.Album;
import com.ukim.finki.develop.finkwave.model.Song;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArtistMusicalEntitiesDTO {
    private List<ArtistContributionDTO> contributions;
}