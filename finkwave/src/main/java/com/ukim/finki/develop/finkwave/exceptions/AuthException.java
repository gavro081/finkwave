package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public abstract class AuthException extends RuntimeException {
    
    public AuthException(String message) {
        super(message);
    }
    
    public AuthException(String message, Throwable cause) {
        super(message, cause);
    }

    public abstract HttpStatus getStatus();
}
