package com.ukim.finki.develop.finkwave.dto;

import jakarta.annotation.Nullable;

public record LoginRequestDto(
        String username,
        String password
){
}
