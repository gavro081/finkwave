package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.*;
import com.ukim.finki.develop.finkwave.model.dto.*;
import com.ukim.finki.develop.finkwave.repository.*;
import com.ukim.finki.develop.finkwave.service.mappers.NonAdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    private final SavedPlaylistRepository savedPlaylistRepository;

    @Transactional(readOnly = true)
    public List<NonAdminUserDto> getAllUsers() {
        return nonAdminUserRepository.findAllWithUser().stream()
                .map(user -> {
                    String type = determineType(user.getId());
                    return mapper.toDto(user, type, new FollowStatusDto(false,null,null));
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NonAdminUserDto getNonAdminUserProfile(String username) {
        Long currentUserId = authService.getCurrentUserIDOptional().orElse(null);

        Optional<Artist>artistOptional=artistRepository.findByUsername(username);
    
        if (artistOptional.isPresent()) {
            Artist artist = artistOptional.get();
            return getArtistProfile(artist, currentUserId);
        }

        Optional<Listener>listenerOptional=listenerRepository.findByUsername(username);
      
        if (listenerOptional.isPresent()) {
            Listener listener=listenerOptional.get();
            return getListenerProfile(listener,currentUserId);
        }

        throw new UserNotFoundException("User not found: " + username);
    }

    private FollowStatusDto getFollowingInfo(Long id,Long currentUserId){

        Long followers = followRepository.countByFolloweeId(id);
        Long following = followRepository.countByFollowerId(id);
        boolean isFollowing = currentUserId != null && followRepository.isFollowing(currentUserId, id);
        return new FollowStatusDto(isFollowing,followers,following);
    }

    private NonAdminUserDto getArtistProfile(Artist artist,Long currentUserId) {
        Long artistId=artist.getId();

        List<ArtistContributionDto>artistContributionDtos=artistService.getArtistContributions(artistId, currentUserId);
        FollowStatusDto followStatusDto=getFollowingInfo(artistId,currentUserId);

        return mapper.toArtistDTO(artist, artistContributionDtos,followStatusDto);
    }

    private NonAdminUserDto getListenerProfile(Listener listener, Long currentUserId) {
        Long profileId = listener.getId();

        FollowStatusDto followStatusDto = getFollowingInfo(profileId, currentUserId);


        List<MusicalEntityDto> likedEntities = listenerService.getLikedEntities(currentUserId, profileId);

        Set<Long> visitorSavedPlaylistIds = (currentUserId != null)
                ? savedPlaylistRepository.findAllByListener_Id(currentUserId).stream()
                .map(sp -> sp.getPlaylist().getId())
                .collect(Collectors.toSet())
                : Collections.emptySet();


        List<PlaylistDto> createdPlaylists = listenerService.getPlaylistsCreatedByUser(profileId).stream()
                .map(p -> mapToPlaylistDto(p, visitorSavedPlaylistIds))
                .toList();


        List<PlaylistDto> savedPlaylists = savedPlaylistRepository.findSavedPlaylistsMetadata(profileId).stream()
                .map(p -> mapToPlaylistDto(p, visitorSavedPlaylistIds))
                .toList();

        return mapper.toListenerDTO(listener, likedEntities, followStatusDto, createdPlaylists, savedPlaylists);
    }


    public List<NonAdminUserDto>searchUsers(String name){

        List<NonAdminUser>nonAdminUsers=nonAdminUserRepository.searchByName(name);
        if (nonAdminUsers.isEmpty()){
            throw new UserNotFoundException("No users matched the criteria");
        }

        return nonAdminUserRepository.searchByName(name).stream()
                .map(user -> {
                    Long userId= user.getId();
                    String type = determineType(userId);
                    FollowStatusDto followStatusDto=getFollowingInfo(userId,null);
                    return mapper.toDto(user, type,followStatusDto);
                })
                .collect(Collectors.toList());
    }


    private PlaylistDto mapToPlaylistDto(Playlist p, Set<Long> savedBy) {
        return new PlaylistDto(
                p.getId(),
                p.getName(),
                p.getCover(),
                p.getCreatedBy().getNonAdminUser().getUser().getFullName(),
                null,
                savedBy.contains(p.getId())
        );
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