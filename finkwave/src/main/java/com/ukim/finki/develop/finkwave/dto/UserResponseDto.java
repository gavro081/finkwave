package com.ukim.finki.develop.finkwave.dto;

import com.ukim.finki.develop.finkwave.model.Role;
import jakarta.annotation.Nullable;
import lombok.Builder;

@Builder
public record UserResponseDto(
        String fullname,
        String username,
        @Nullable String profilePhoto,
        Role role){
}
