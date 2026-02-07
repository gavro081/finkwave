package com.ukim.finki.develop.finkwave.model.dto;

import jakarta.annotation.Nullable;

public record BasicSongDto (
    Long id,
    String title,
    String artist,
    String link,
    @Nullable String cover
){}
