package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SongWithLinkDto extends MusicalEntityDto {
    String link;

    public SongWithLinkDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, String cover, Boolean isLikedByCurrentUser, String link) {
        super(id, title, genre, type, releasedBy, artistUsername, cover, isLikedByCurrentUser);
        this.link = link;
    }
}
