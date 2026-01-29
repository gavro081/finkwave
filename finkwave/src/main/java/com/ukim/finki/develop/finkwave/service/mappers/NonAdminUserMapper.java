package com.ukim.finki.develop.finkwave.service.mappers;

import com.ukim.finki.develop.finkwave.model.Artist;

import com.ukim.finki.develop.finkwave.model.Listener;

import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class NonAdminUserMapper {

    public NonAdminUserDto toArtistDTO(Artist artist, List<ArtistContributionDto> entitiesDTO, Long followers, Long following) {
        ArtistDto dto=new ArtistDto();
        populateBaseClassFields(dto,artist.getNonAdminUser(),"ARTIST",followers,following);
        dto.setContributions(entitiesDTO);
        return dto;
    }

    public NonAdminUserDto toListenerDTO(Listener listener, List<MusicalEntityDto> musicalEntityDtos, Long followers, Long following, List<PlaylistDto>playlists) {
        ListenerDto dto=new ListenerDto();
        populateBaseClassFields(dto,listener.getNonAdminUser(),"LISTENER",followers,following);
        dto.setLikedEntities(musicalEntityDtos);
        dto.setCreatedPlaylists(playlists);
        return dto;
    }

    public NonAdminUserDto toDto(NonAdminUser user,String type, Long followers,Long following){
       NonAdminUserDto dto=new NonAdminUserDto();
       populateBaseClassFields(dto,user,type,followers,following);
       return dto;
    }

    private void populateBaseClassFields(NonAdminUserDto dto,NonAdminUser user,String type,Long followers,Long following){
        dto.setId(user.getId());
        dto.setUsername(user.getUser().getUsername());
        dto.setFullName(user.getUser().getFullName());
        dto.setUserType(type);
        dto.setFollowers(followers);
        dto.setFollowing(following);
    }
}
