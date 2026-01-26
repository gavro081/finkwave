package com.ukim.finki.develop.finkwave.model.dto;

import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

public record AuthRequestDto(
        String username,
        String fullname,
        String email,
        String password,
        @Nullable MultipartFile profilePhoto){
}
