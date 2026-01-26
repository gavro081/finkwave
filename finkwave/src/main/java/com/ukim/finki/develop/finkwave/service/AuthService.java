package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.config.AuthProperties;
import com.ukim.finki.develop.finkwave.dto.LoginRequestDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ukim.finki.develop.finkwave.dto.AuthRequestDto;
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
    private final AuthProperties authProperties;


    public UserResponseDto registerAndLogIn(HttpServletResponse response, AuthRequestDto authRequestDto){
        if (userRepository.findByUsername(authRequestDto.username()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        createNonAdminUser(authRequestDto);
        // todo: could also be redirect in controller, which one is better?
        return login(response, new LoginRequestDto(authRequestDto.username(), authRequestDto.password()));
    }

    // todo: dto in arguments or the standalone values?
    public UserResponseDto login(HttpServletResponse response, LoginRequestDto loginRequestDto){
        User user = userRepository.findByUsername(loginRequestDto.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtService.generateToken(loginRequestDto.username(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        UserResponseDto userResponseDto = new UserResponseDto(user.getUsername(), user.getRole());
        addTokensToResponse(response, refreshToken, accessToken);
        return userResponseDto;
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
        accessCookie.setMaxAge(authProperties.getAccessTokenMaxAge());
        response.addCookie(accessCookie);
    }

    public void clearCookies(HttpServletResponse httpServletResponse, String refreshToken) {
        if (refreshToken != null){
            invalidateRefreshToken(refreshToken);
            clearCookieByName(httpServletResponse, "refreshToken");
        }
        clearCookieByName(httpServletResponse, "accessToken");
    }

    // todo: should it be transactional?
//    @Transactional
    private void createNonAdminUser(AuthRequestDto authRequestDto){
        User user = User.builder()
                .fullName(authRequestDto.fullname())
                .username(authRequestDto.username())
                .email(authRequestDto.email())
                .profilePhoto(authRequestDto.profilePhoto())
                .password(passwordEncoder.encode(authRequestDto.password()))
                .role(Role.NONADMIN)
                .build();

        NonAdminUser nonAdminUser = new NonAdminUser();
        nonAdminUser.setUser(user);
        user.setNonAdminUser(nonAdminUser);
        nonAdminUserRepository.save(nonAdminUser);
        userRepository.save(user);
    }

    private void clearCookieByName(HttpServletResponse response, String cookieName){
        Cookie clearAccess = new Cookie(cookieName, null);
        clearAccess.setHttpOnly(true);
        clearAccess.setSecure(false);
        clearAccess.setPath("/");
        clearAccess.setMaxAge(0);
        response.addCookie(clearAccess);
    }


    private void addTokensToResponse(HttpServletResponse response, RefreshToken refreshToken, String accessToken){
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken.getToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(authProperties.getRefreshTokenMaxAge());
        response.addCookie(refreshCookie);

        addAccessCookieToResponse(response, accessToken);
    }
}
