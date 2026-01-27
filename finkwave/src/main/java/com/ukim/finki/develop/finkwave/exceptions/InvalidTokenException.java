package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends AuthException {
    
    public InvalidTokenException() {
        super("Invalid or expired token.");
    }
    
    public InvalidTokenException(String message) {
        super(message);
    }
    
    @Override
    public HttpStatus getStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}
