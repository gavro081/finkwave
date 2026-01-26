package com.ukim.finki.develop.finkwave.model.dto;

import com.ukim.finki.develop.finkwave.model.Album;
import com.ukim.finki.develop.finkwave.model.Song;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ArtistMusicalEntitiesDTO {
    private List<Song> songs;
    private List<Album> albums;
}