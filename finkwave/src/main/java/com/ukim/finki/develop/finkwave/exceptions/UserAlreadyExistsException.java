package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends AuthException {
    
    public UserAlreadyExistsException(String username) {
        super("Username '" + username + "' is already taken.");
    }
    public UserAlreadyExistsException() {
        super("Username is already taken.");
    }
    
    @Override
    public HttpStatus getStatus() {
        return HttpStatus.CONFLICT;
    }
}
