package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.*;
import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.repository.*;
import com.ukim.finki.develop.finkwave.service.mappers.NonAdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public List<NonAdminUserDTO> getAllUsers() {
        return nonAdminUserRepository.findAllWithUser().stream()
                .map(user -> {
                    String type = determineType(user.getId());
                    Long followers = followRepository.countByFolloweeId(user.getId());
                    Long following = followRepository.countByFollowerId(user.getId());
                    return mapper.toDTO(user, type, followers, following);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NonAdminUserDTO getById(Long id) {
        Long followers=followRepository.countByFolloweeId(id);
        Long following=followRepository.countByFollowerId(id);
        Long currentUserId= authService.getCurrentUserID();

        boolean isFollowedByCurrentUser=false;
        if (currentUserId != null) {
            isFollowedByCurrentUser = followRepository.isFollowing(currentUserId, id);
        }
        NonAdminUserDTO dto;
    
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

    private NonAdminUserDTO getArtistProfile(Long artistId, Long followers,Long following) {
        Artist artist = artistRepository.findByIdWithUser(artistId)
            .orElseThrow(() -> new RuntimeException("Artist not found with id: " + artistId));


        ArtistMusicalEntitiesDTO entitiesDTO = new ArtistMusicalEntitiesDTO();
        entitiesDTO.setContributions(artistService.getArtistContributions(artistId));

        return mapper.toArtistDTO(artist, entitiesDTO,followers,following);
    }

    private NonAdminUserDTO getListenerProfile(Long listenerId, Long followers,Long following) {
        Listener listener = listenerRepository.findByIdWithUser(listenerId)
            .orElseThrow(() -> new RuntimeException("Listener not found with id: " + listenerId));


        ListenerLikesDTO likesDTO = listenerService.getLikedEntities(listenerId);
        List<PlaylistDTO>playlists=listenerService.getPlaylistsCreatedByUser(listenerId).stream()
                .map(p->new PlaylistDTO(
                        p.getId(),
                        p.getName(),
                        p.getCover(),
                        p.getCreatedBy().getNonAdminUser().getUser().getFullName()
                )).toList();

        return mapper.toListenerDTO(listener, likesDTO,followers,following,playlists);
    }


    public List<NonAdminUserDTO>searchUsers(String name){

        List<NonAdminUser>nonAdminUsers=nonAdminUserRepository.searchByName(name);
        if (nonAdminUsers.isEmpty()){
            throw new RuntimeException("No user found");
        }

        return nonAdminUserRepository.searchByName(name).stream()
                .map(user -> {
                    String type = determineType(user.getId());
                    Long followers = followRepository.countByFolloweeId(user.getId());
                    Long following = followRepository.countByFollowerId(user.getId());
                    return mapper.toDTO(user, type, followers, following);
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