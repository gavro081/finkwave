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


    public SongDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, String cover, Boolean isLikedByCurrentUser, String album, Long albumId, String link) {
        super(id, title, genre, type, releasedBy, artistUsername, cover, isLikedByCurrentUser, album, albumId);
        this.link = link;
    }

    public SongDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, Boolean isLikedByCurrentUser, String link) {
        super(id, title, genre, type, releasedBy, artistUsername, isLikedByCurrentUser);
        this.link = link;
    }

    public SongDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, String cover, Boolean isLikedByCurrentUser, String link) {
        super(id, title, genre, type, releasedBy, artistUsername, cover, isLikedByCurrentUser);
        this.link = link;
    }
}
