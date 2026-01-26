package com.ukim.finki.develop.finkwave.service.mappers;

import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDTO;
import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDTO;
import com.ukim.finki.develop.finkwave.repository.ArtistContributionRepository;
import com.ukim.finki.develop.finkwave.repository.FollowRepository;
import com.ukim.finki.develop.finkwave.repository.MusicalEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class NonAdminUserMapper {
    private final FollowRepository followRepository;



    public NonAdminUserDTO toDTO(NonAdminUser entity, String type) {
        if (entity == null) return null;

        return new NonAdminUserDTO(
                entity.getId(),
                entity.getUser().getUsername(),
                entity.getUser().getFullName(),
                entity.getUser().getProfilePhoto(),
                followRepository.countByFolloweeId(entity.getId()),
                followRepository.countByFollowerId(entity.getId()),
                type,
                new ArrayList<>(),
                new ArrayList<>()
        );
    }
}
