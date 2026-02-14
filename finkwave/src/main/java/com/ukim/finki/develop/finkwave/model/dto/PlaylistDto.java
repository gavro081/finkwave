package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class PlaylistDto {
    private Long id;
    private String name;
    private String cover;
    private String creatorName;
    private String creatorUsername;
    private List<SongWithLinkDto>songsInPlaylist;
    private Boolean isSavedByCurrentUser;

}
