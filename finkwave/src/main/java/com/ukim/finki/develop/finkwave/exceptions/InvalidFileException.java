package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidFileException extends AuthException {
    
    public InvalidFileException(String message) {
        super(message);
    }
    
    public static InvalidFileException invalidType() {
        return new InvalidFileException("Invalid file type. Only images are allowed.");
    }
    
    public static InvalidFileException tooLarge(long maxSizeBytes) {
        long maxSizeMB = maxSizeBytes / 1_000_000;
        return new InvalidFileException("File too large. Maximum size is " + maxSizeMB + "MB.");
    }
    
    @Override
    public HttpStatus getStatus() {
        return HttpStatus.BAD_REQUEST;
    }
}
