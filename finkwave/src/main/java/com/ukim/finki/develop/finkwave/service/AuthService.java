package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.dto.LoginRequestDto;
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
    private final int refreshTokenMaxAge = 10 * 24 * 60 * 60;

    // todo: should it be transactional?
//    @Transactional
    public AuthResponseDto registerAndLogIn(HttpServletResponse response, AuthRequestDto authRequestDto){
        if (userRepository.findByUsername(authRequestDto.username()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        User user = new User();

        // todo: builder / private createUser method
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
        // todo: could also be redirect in controller, which one is better?
        return login(response, new LoginRequestDto(user.getUsername(), authRequestDto.password()));
    }


    // todo: dto in arguments or the standalone values?
    public AuthResponseDto login(HttpServletResponse response, LoginRequestDto loginRequestDto){
        User user = userRepository.findByUsername(loginRequestDto.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtService.generateToken(loginRequestDto.username(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        UserResponseDto userResponseDto = new UserResponseDto(user.getUsername(), user.getRole());
        // todo: dto inside a dto??
        AuthResponseDto authResponseDto = new AuthResponseDto(accessToken, refreshToken, userResponseDto);
        addTokensToResponse(response, authResponseDto);
        return authResponseDto;
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

    public void clearCookies(HttpServletResponse httpServletResponse, String refreshToken) {
        if (refreshToken != null){
            invalidateRefreshToken(refreshToken);
            Cookie clearCookie = new Cookie("refreshToken", null);
            clearCookie.setHttpOnly(true);
            clearCookie.setSecure(false);
            clearCookie.setPath("/");
            clearCookie.setMaxAge(0);
            httpServletResponse.addCookie(clearCookie);
        }

        Cookie clearAccess = new Cookie("accessToken", null);
        clearAccess.setHttpOnly(true);
        clearAccess.setSecure(false);
        clearAccess.setPath("/");
        clearAccess.setMaxAge(0);
        httpServletResponse.addCookie(clearAccess);
    }


    private void addTokensToResponse(HttpServletResponse response, AuthResponseDto authResponse){
        Cookie refreshCookie = new Cookie("refreshToken", authResponse.refreshToken().getToken());
        refreshCookie.setSecure(false);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(refreshTokenMaxAge);
        response.addCookie(refreshCookie);

        addAccessCookieToResponse(response, authResponse.accessToken());
    }
}
