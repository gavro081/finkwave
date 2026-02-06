package com.ukim.finki.develop.finkwave.model.dto;


public record BasicPlaylistDto(
    Long id,
    String name,
    String cover,
    Long songCount){}
