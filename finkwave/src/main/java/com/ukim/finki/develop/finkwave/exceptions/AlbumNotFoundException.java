package com.ukim.finki.develop.finkwave.exceptions;

public class AlbumNotFoundException extends RuntimeException {
    public AlbumNotFoundException(Long id) {
        super(String.format("Cannot find album with id: %d", id));
    }
}
