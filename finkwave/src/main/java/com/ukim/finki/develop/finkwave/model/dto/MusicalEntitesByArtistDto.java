package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class MusicalEntitesByArtistDto {
    private Long id;
    private String title;
    private String genre;
    private String type;
    private String cover;
    private LocalDate releaseDate;
}
