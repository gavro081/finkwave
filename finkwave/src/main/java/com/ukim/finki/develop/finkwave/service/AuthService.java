package com.ukim.finki.develop.finkwave.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ukim.finki.develop.finkwave.dto.AuthRequestDto;
import com.ukim.finki.develop.finkwave.dto.AuthResponseDto;
import com.ukim.finki.develop.finkwave.dto.UserResponseDto;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.RefreshToken;
import com.ukim.finki.develop.finkwave.model.Role;
import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.repository.NonAdminUserRepository;
import com.ukim.finki.develop.finkwave.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final NonAdminUserRepository nonAdminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final int accessTokenMaxAge = 900;

    // todo: should it be transactional?
//    @Transactional
    public AuthResponseDto registerAndLogIn(AuthRequestDto authRequestDto){
        if (userRepository.findByUsername(authRequestDto.username()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        User user = new User();

        // todo: builder
        user.setUsername(authRequestDto.username());
        user.setRole(Role.NONADMIN);
        user.setFullName(authRequestDto.fullname());
        user.setProfilePhoto(authRequestDto.profilePhoto());
        user.setEmail(authRequestDto.email());
        user.setPassword(passwordEncoder.encode(authRequestDto.password()));
        NonAdminUser nonAdminUser = new NonAdminUser();
        nonAdminUser.setUser(user);
        user.setNonAdminUser(nonAdminUser);
        nonAdminUserRepository.save(nonAdminUser);
        userRepository.save(user);
        return login(user.getUsername(), authRequestDto.password());
    }


    public AuthResponseDto login(String username, String password){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtService.generateToken(username, user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        UserResponseDto userResponseDto = new UserResponseDto(user.getUsername(), user.getRole());
        return new AuthResponseDto(accessToken, refreshToken, userResponseDto);
    }

    public String refreshAccessToken(String refreshTokenString) {
        RefreshToken refreshToken = refreshTokenService.validateRefreshToken(refreshTokenString);
        User user = refreshToken.getUser();
        return jwtService.generateToken(user.getUsername(), user.getRole().name());
    }

    public void refreshAccessTokenAndAddCookie(HttpServletResponse response, String refreshToken){
        String accessToken = refreshAccessToken(refreshToken);
        addAccessCookieToResponse(response, accessToken);
    }

    public UserResponseDto getUserDtoByUsername(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        return new UserResponseDto(user.getUsername(), user.getRole());
    }

    public void invalidateRefreshToken(String refreshToken) {
        refreshTokenService.revokeToken(refreshToken);
    }

    public void addAccessCookieToResponse(HttpServletResponse response, String accessToken){
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(accessTokenMaxAge);
        response.addCookie(accessCookie);
    }
}
