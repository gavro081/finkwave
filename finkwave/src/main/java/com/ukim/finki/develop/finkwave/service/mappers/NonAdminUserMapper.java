package com.ukim.finki.develop.finkwave.service.mappers;

import com.ukim.finki.develop.finkwave.model.Artist;

import com.ukim.finki.develop.finkwave.model.Listener;

import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.FollowStatusDto;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class NonAdminUserMapper {

    public NonAdminUserDto toArtistDTO(Artist artist, List<ArtistContributionDto> entitiesDTO, FollowStatusDto followStatusDto) {
        ArtistDto dto=new ArtistDto();
        populateBaseClassFields(dto,artist.getNonAdminUser(),"ARTIST",followStatusDto);
        dto.setContributions(entitiesDTO);
        return dto;
    }

    public NonAdminUserDto toListenerDTO(Listener listener,
                                         List<MusicalEntityDto> musicalEntityDtos,
                                         FollowStatusDto followStatusDto,
                                         List<PlaylistDto>createdPlaylists,
                                         List<PlaylistDto>savedPlaylists) {
        ListenerDto dto=new ListenerDto();
        populateBaseClassFields(dto,listener.getNonAdminUser(),"LISTENER",followStatusDto);
        dto.setLikedEntities(musicalEntityDtos);
        dto.setCreatedPlaylists(createdPlaylists);
        dto.setSavedPlaylists(savedPlaylists);
        return dto;
    }

    public NonAdminUserDto toDto(NonAdminUser user,String type, FollowStatusDto followStatusDto){
       NonAdminUserDto dto=new NonAdminUserDto();
       populateBaseClassFields(dto,user,type,followStatusDto);
       return dto;
    }



    private void populateBaseClassFields(NonAdminUserDto dto,NonAdminUser user,String type,FollowStatusDto followStatusDto){
        dto.setUsername(user.getUser().getUsername());
        dto.setFullName(user.getUser().getFullName());
        dto.setProfilePhoto(user.getUser().getProfilePhoto());
        dto.setUserType(type);
        dto.setFollowers(followStatusDto.followerCount());
        dto.setFollowing(followStatusDto.followingCount());
        dto.setIsFollowedByCurrentUser(followStatusDto.isFollowing());
    }
}
