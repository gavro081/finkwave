package com.ukim.finki.develop.finkwave.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SongDto extends MusicalEntityDto{
    private String link;

    // todo: clean up constructors

    public SongDto(Long id, String title, String genre, String type, String releasedBy, String cover, Boolean isLikedByCurrentUser, String album, String link) {
        super(id, title, genre, type, releasedBy, cover, isLikedByCurrentUser, album);
        this.link = link;
    }

    public SongDto(Long id, String title, String genre, String type, String releasedBy, Boolean isLikedByCurrentUser, String link) {
        super(id, title, genre, type, releasedBy, isLikedByCurrentUser);
        this.link = link;
    }

    public SongDto(Long id, String title, String genre, String type, String releasedBy, String cover, Boolean isLikedByCurrentUser, String link) {
        super(id, title, genre, type, releasedBy, cover, isLikedByCurrentUser);
        this.link = link;
    }

}
