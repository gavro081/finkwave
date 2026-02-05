package com.ukim.finki.develop.finkwave.model.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public  class NonAdminUserDto {
    private String username;
    private String fullName;
    private String profilePhoto;
    private String userType;
    private Long followers;
    private Long following;
    private Boolean isFollowedByCurrentUser;


}