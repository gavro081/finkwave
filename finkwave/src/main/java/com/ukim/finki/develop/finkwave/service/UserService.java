package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository usersRepository;

    public List<User> getAll(){
        return usersRepository.findAll();
    }

}
