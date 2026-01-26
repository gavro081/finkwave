package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NonAdminUserDTO {
    private Long Id;
    private String username;
    private String fullName;
    private String profilePhoto;
    private Long followerCount;
    private Long followingCount;
    private String userType;
    // is it best practice to have this empty in listeners?
    private List<ArtistContributionDTO> contributions;
    private List<ListenerLikesDTO> likedEntities;
}
