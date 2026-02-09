package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.model.dto.UserSearchResultDto;
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

    public List<UserSearchResultDto> search(UserType userType, String searchTerm, int limit){
        return switch (userType) {
            case ARTIST -> usersRepository.searchArtists(searchTerm, limit);
            case LISTENER -> usersRepository.searchListeners(searchTerm, limit);
            case null -> throw new IllegalArgumentException("Invalid userType");
        };
    }

}
