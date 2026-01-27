package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends AuthException {
    
    public UserNotFoundException() {
        super("User not found.");
    }
    
    public UserNotFoundException(String message) {
        super(message);
    }
    
    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
