package com.ukim.finki.develop.finkwave.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ListenerDto extends NonAdminUserDto {
    private List<MusicalEntityDto> likedEntities;
    private List<PlaylistDto> createdPlaylists;
}
