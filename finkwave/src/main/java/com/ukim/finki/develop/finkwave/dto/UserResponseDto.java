package com.ukim.finki.develop.finkwave.dto;

import com.ukim.finki.develop.finkwave.model.Role;

public record UserResponseDto(
        String username,
        Role role){
}
