package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class MusicalEntityDto {
    private Long id;
    private String title;
    private String genre;
    private String type;
}
