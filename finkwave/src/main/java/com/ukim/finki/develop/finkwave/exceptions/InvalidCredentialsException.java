package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AuthException {
    
    public InvalidCredentialsException() {
        super("Invalid credentials.");
    }
    
    public InvalidCredentialsException(String message) {
        super(message);
    }
    
    @Override
    public HttpStatus getStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}
