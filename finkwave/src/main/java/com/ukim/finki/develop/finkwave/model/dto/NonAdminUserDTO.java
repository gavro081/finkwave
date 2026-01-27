package com.ukim.finki.develop.finkwave.model.dto;

import com.ukim.finki.develop.finkwave.model.Playlist;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter

public class NonAdminUserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String userType;
    private Long followers;
    private Long following;
    private Boolean isFollowedByCurrentUser;


    
    private ArtistMusicalEntitiesDTO musicalEntities;
    
    private ListenerLikesDTO likes;
    private List<PlaylistDTO>createdPlaylists;
}