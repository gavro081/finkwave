package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.model.enums.UserType;
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

    // todo: add dto-s

    public List<User> search(UserType userType, String searchTerm){

        return switch (userType) {
            case ARTIST -> usersRepository.searchArtists(searchTerm);
            case LISTENER -> usersRepository.searchListeners(searchTerm);
            case null -> throw new IllegalArgumentException("Invalid userType");
        };
    }

}
