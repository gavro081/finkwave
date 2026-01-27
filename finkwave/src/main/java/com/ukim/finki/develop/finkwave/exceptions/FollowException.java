package com.ukim.finki.develop.finkwave.exceptions;

import org.springframework.http.HttpStatus;

public class FollowException extends RuntimeException{

    public FollowException(String message){
        super(message);
    }


}
