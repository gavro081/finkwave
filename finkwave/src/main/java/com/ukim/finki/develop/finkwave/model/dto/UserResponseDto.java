package com.ukim.finki.develop.finkwave.model.dto;

import jakarta.annotation.Nullable;
import lombok.Builder;

@Builder
public record UserResponseDto(
        String fullname,
        String username,
        @Nullable String profilePhoto,
        Boolean isAdmin,
        @Nullable Boolean isArtist
){}
