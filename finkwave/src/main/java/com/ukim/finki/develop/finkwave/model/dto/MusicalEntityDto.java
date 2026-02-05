package com.ukim.finki.develop.finkwave.model.dto;

import jakarta.annotation.Nullable;
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
    private String releasedBy;
    private String cover;
    private Boolean isLikedByCurrentUser;

    public MusicalEntityDto(Long id, String title, String genre, String type, String releasedBy, Boolean isLikedByCurrentUser) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.type = type;
        this.releasedBy = releasedBy;
        this.isLikedByCurrentUser = isLikedByCurrentUser;
    }
}
