package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthenticatedException extends AuthException {
    
    public UnauthenticatedException() {
        super("User not authenticated.");
    }
    
    public UnauthenticatedException(String message) {
        super(message);
    }
    
    @Override
    public HttpStatus getStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}
