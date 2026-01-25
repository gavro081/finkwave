package com.ukim.finki.develop.finkwave.dto;

import com.ukim.finki.develop.finkwave.model.RefreshToken;

public record AuthResponseDto (String accessToken, RefreshToken refreshToken, UserResponseDto userResponseDto) {
}

