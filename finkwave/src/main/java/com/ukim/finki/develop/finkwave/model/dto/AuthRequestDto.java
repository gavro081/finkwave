package com.ukim.finki.develop.finkwave.model.dto;

import com.ukim.finki.develop.finkwave.model.enums.UserType;
import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

public record AuthRequestDto(
        String username,
        String fullname,
        String email,
        String password,
        ArrayList<UserType> userType,
        @Nullable MultipartFile profilePhoto){
}
