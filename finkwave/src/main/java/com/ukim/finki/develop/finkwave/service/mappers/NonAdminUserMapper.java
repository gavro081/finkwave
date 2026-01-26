package com.ukim.finki.develop.finkwave.service.mappers;

import com.ukim.finki.develop.finkwave.model.Artist;

import com.ukim.finki.develop.finkwave.model.Listener;

import com.ukim.finki.develop.finkwave.model.Playlist;
import com.ukim.finki.develop.finkwave.model.dto.ArtistMusicalEntitiesDTO;
import com.ukim.finki.develop.finkwave.model.dto.ListenerLikesDTO;
import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDTO;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.dto.PlaylistDTO;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class NonAdminUserMapper {

    public NonAdminUserDTO toArtistDTO(Artist artist, ArtistMusicalEntitiesDTO entitiesDTO, Long followers, Long following) {
        NonAdminUserDTO dto = createBaseDTO(
            artist.getNonAdminUser(), 
            "ARTIST", 
            followers, 
            following
        );
        dto.setMusicalEntities(entitiesDTO);
        return dto;
    }

    public NonAdminUserDTO toListenerDTO(Listener listener, ListenerLikesDTO likesDTO, Long followers, Long following, List<PlaylistDTO>playlists) {
        NonAdminUserDTO dto = createBaseDTO(
            listener.getNonAdminUser(), 
            "LISTENER", 
            followers, 
            following
        );
        dto.setLikes(likesDTO);
        dto.setCreatedPlaylists(playlists);
        return dto;
    }

    public NonAdminUserDTO toDTO(NonAdminUser user, String type,Long followers,Long following) {
        return createBaseDTO(user, type, followers, following);
    }

    private NonAdminUserDTO createBaseDTO(NonAdminUser user, String userType, Long followers, Long following) {
        NonAdminUserDTO dto = new NonAdminUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUser().getUsername());
        dto.setFullName(user.getUser().getFullName());
        dto.setUserType(userType);
        dto.setFollowers(followers);
        dto.setFollowing(following);
        return dto;
    }
}
