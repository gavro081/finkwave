package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class PlaylistDTO {
    private Long id;
    private String name;
    private String cover;
    private String creatorName;

}
