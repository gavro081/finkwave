package com.ukim.finki.develop.finkwave.controller;

import java.util.Map;

import com.ukim.finki.develop.finkwave.exceptions.*;
import com.ukim.finki.develop.finkwave.repository.PlaylistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<Map<String, String>> handleAuthException(AuthException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUsernameNotFound(UsernameNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials."));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(NotAuthorizedException.class)
    public ResponseEntity<Map<String, String>> handleNotAuthorizedAction(NotAuthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(FollowException.class)
    public ResponseEntity<Map<String, String>> handleSelfFollow(FollowException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(AlbumNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleAlbumNotFound(AlbumNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MusicalEntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleMusicalEntityNotFound(MusicalEntityNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(PlaylistAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handlePlaylistAlreadyExits(PlaylistAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }



    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        logger.error("Response status error: {}", ex.getMessage());
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(Map.of("error", ex.getReason() != null ? ex.getReason() : "An error occurred."));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSize(MaxUploadSizeExceededException ex) {
        logger.error("Max upload size error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(Map.of(
                        "error", "File too large.",
                        "maxSize", "2MB"
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        logger.error("Unexpected error occurred: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred."));
    }
}
