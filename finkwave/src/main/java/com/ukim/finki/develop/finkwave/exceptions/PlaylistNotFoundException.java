package com.ukim.finki.develop.finkwave.exceptions;

public class PlaylistNotFoundException extends RuntimeException {
    public PlaylistNotFoundException(Long id) {
        super(String.format("Cannot find playlist with id: %d",id));
    }
}
