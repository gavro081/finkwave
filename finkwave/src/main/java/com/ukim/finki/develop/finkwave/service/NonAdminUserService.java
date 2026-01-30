package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.*;
import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.repository.*;
import com.ukim.finki.develop.finkwave.service.mappers.NonAdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NonAdminUserService {
    private final NonAdminUserRepository nonAdminUserRepository;
    private final ListenerRepository listenerRepository;
    private final ArtistRepository artistRepository;
    private final NonAdminUserMapper mapper;
    private final ArtistService artistService;
    private final ListenerService listenerService;
    private final FollowRepository followRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<NonAdminUserDto> getAllUsers() {
        return nonAdminUserRepository.findAllWithUser().stream()
                .map(user -> {
                    String type = determineType(user.getId());
                    return mapper.toDto(user, type, null, null);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NonAdminUserDto getById(Long id) {
        Long followers=followRepository.countByFolloweeId(id);
        Long following=followRepository.countByFollowerId(id);
        Long currentUserId= authService.getCurrentUserID();

        boolean isFollowedByCurrentUser=false;
        if (currentUserId != null) {
            isFollowedByCurrentUser = followRepository.isFollowing(currentUserId, id);
        }
        NonAdminUserDto dto;
    
        if (artistRepository.existsById(id)) {
             dto=getArtistProfile(id, followers, following);
             dto.setIsFollowedByCurrentUser(isFollowedByCurrentUser);
             return dto;
        }
      
        if (listenerRepository.existsById(id)) {
            dto=getListenerProfile(id, followers, following);
            dto.setIsFollowedByCurrentUser(isFollowedByCurrentUser);
            return dto;
        }
        
        throw new RuntimeException("User not found with id: " + id);
    }

    private NonAdminUserDto getArtistProfile(Long artistId, Long followers, Long following) {
        Artist artist = artistRepository.findByIdWithUser(artistId)
            .orElseThrow(()->new UserNotFoundException("Artist not found with id: " + artistId));


        List<ArtistContributionDto>artistContributionDtos=artistService.getArtistContributions(artistId);

        return mapper.toArtistDTO(artist, artistContributionDtos,followers,following);
    }

    private NonAdminUserDto getListenerProfile(Long listenerId, Long followers, Long following) {
        Listener listener = listenerRepository.findByIdWithUser(listenerId)
            .orElseThrow(()->new UserNotFoundException("Listener not found with id: " + listenerId));


        List<MusicalEntityDto>musicalEntityDtos=listenerService.getLikedEntities(listenerId);
        List<PlaylistDto>playlists=listenerService.getPlaylistsCreatedByUser(listenerId).stream()
                .map(p->new PlaylistDto(
                        p.getId(),
                        p.getName(),
                        p.getCover(),
                        p.getCreatedBy().getNonAdminUser().getUser().getFullName()
                )).toList();

        return mapper.toListenerDTO(listener, musicalEntityDtos,followers,following,playlists);
    }


    public List<NonAdminUserDto>searchUsers(String name){

        List<NonAdminUser>nonAdminUsers=nonAdminUserRepository.searchByName(name);
        if (nonAdminUsers.isEmpty()){
            throw new UserNotFoundException("No users matched the criteria");
        }

        return nonAdminUserRepository.searchByName(name).stream()
                .map(user -> {
                    String type = determineType(user.getId());
                    Long followers = followRepository.countByFolloweeId(user.getId());
                    Long following = followRepository.countByFollowerId(user.getId());
                    return mapper.toDto(user, type, followers, following);
                })
                .collect(Collectors.toList());
    }



    private String determineType(Long id) {
        if (artistRepository.existsById(id)) {
            return "Artist";
        } else if (listenerRepository.existsById(id)) {
            return "Listener";
        }
        return "Admin";
    }
}