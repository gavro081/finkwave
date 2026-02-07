package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AlbumDto extends MusicalEntityDto{
    private List<MusicalEntityDto>songs;

    public AlbumDto(Long id, String title, String genre, String type, String releasedBy, String artistUsername, Boolean isLikedByCurrentUser) {
        super(id, title, genre, type, releasedBy, artistUsername, isLikedByCurrentUser);
    }


}
