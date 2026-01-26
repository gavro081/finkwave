package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.Artist;
import com.ukim.finki.develop.finkwave.model.Listener;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDTO;
import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDTO;
import com.ukim.finki.develop.finkwave.repository.ArtistRepository;
import com.ukim.finki.develop.finkwave.repository.FollowRepository;
import com.ukim.finki.develop.finkwave.repository.ListenerRepository;
import com.ukim.finki.develop.finkwave.repository.NonAdminUserRepository;
import com.ukim.finki.develop.finkwave.service.mappers.NonAdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    public List<NonAdminUserDTO> getAllUsers() {
        return nonAdminUserRepository.findAllWithUser().stream()
                .map(user -> {
                    String type = determineType(user.getId());
                    return mapper.toDTO(user, type);
                })
                .collect(Collectors.toList());
    }

    public NonAdminUserDTO getById(Long id) {
        NonAdminUser userEntity = nonAdminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        String type = determineType(id);
        NonAdminUserDTO dto = mapper.toDTO(userEntity, type);
        if (type.equals("Artist")){
            List<ArtistContributionDTO> workHistory = artistService.getArtistContributions(id);
            dto.setContributions(workHistory);
        }else if(type.equals("Listener")){
            dto.setLikedEntities(listenerService.getLikedEntities(id));
        }

       return dto;
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
