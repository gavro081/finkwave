package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.Users;
import com.ukim.finki.develop.finkwave.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {
    private final UsersRepository usersRepository;

    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public List<Users> getAll(){
        return usersRepository.findAll();
    }

}
