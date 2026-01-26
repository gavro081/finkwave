package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.Album;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.Song;
import com.ukim.finki.develop.finkwave.model.dto.ArtistMusicalEntitiesDTO;
import com.ukim.finki.develop.finkwave.repository.AlbumRepository;
import com.ukim.finki.develop.finkwave.repository.MusicalEntityRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MusicalEntityService {

    private final MusicalEntityRepository musicalEntityRepository;
    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;

    public ArtistMusicalEntitiesDTO getArtistMusicalEntities(Long artistId){
        List<Long>entitiesIDs=musicalEntityRepository.findAllByReleasedBy_Id(artistId).stream()
                .map(MusicalEntity::getId)
                .toList();

        if (entitiesIDs.isEmpty()) {
            return new ArtistMusicalEntitiesDTO(Collections.emptyList(), Collections.emptyList());
        }

        // bulk fetching
        List<Song> songs = songRepository.findAllByIdIn(entitiesIDs);

        List<Album> albums = albumRepository.findAllByIdIn(entitiesIDs);

        return new ArtistMusicalEntitiesDTO(songs, albums);
    }

    public String getEntityType(Long id) {
        if (songRepository.existsById(id)) return "Song";
        if (albumRepository.existsById(id)) return "Album";
        return "Unknown";
    }

}
