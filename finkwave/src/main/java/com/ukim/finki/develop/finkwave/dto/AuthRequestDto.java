package com.ukim.finki.develop.finkwave.dto;

import jakarta.annotation.Nullable;

public record AuthRequestDto(
        String username,
        String fullname,
        String email,
        String password,
        @Nullable String profilePhoto
){
}
