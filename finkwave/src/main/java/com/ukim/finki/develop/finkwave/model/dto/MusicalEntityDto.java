package com.ukim.finki.develop.finkwave.model.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class MusicalEntityDto {
    private Long id;
    private String title;
    private String genre;
    private String type;
    private String releasedBy;
    private String cover;
    private Boolean isLikedByCurrentUser;
    private String album;

    public MusicalEntityDto(Long id, String title, String genre, String type, String releasedBy, Boolean isLikedByCurrentUser) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.type = type;
        this.releasedBy = releasedBy;
        this.isLikedByCurrentUser = isLikedByCurrentUser;
    }

    public MusicalEntityDto(Long id, String title, String genre, String type, String releasedBy, String cover, Boolean isLikedByCurrentUser) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.type = type;
        this.releasedBy = releasedBy;
        this.cover = cover;
        this.isLikedByCurrentUser = isLikedByCurrentUser;
    }
}
