package com.ukim.finki.develop.finkwave.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ukim.finki.develop.finkwave.config.AuthProperties;
import com.ukim.finki.develop.finkwave.model.dto.AuthRequestDto;
import com.ukim.finki.develop.finkwave.model.dto.LoginRequestDto;
import com.ukim.finki.develop.finkwave.model.dto.UserResponseDto;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.RefreshToken;
import com.ukim.finki.develop.finkwave.model.Role;
import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.repository.NonAdminUserRepository;
import com.ukim.finki.develop.finkwave.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final NonAdminUserRepository nonAdminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthProperties authProperties;


    @Transactional
    public UserResponseDto registerAndLogIn(HttpServletResponse response, AuthRequestDto authRequestDto)
    throws IOException {
        if (userRepository.findByUsername(authRequestDto.username()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        User user = createNonAdminUser(authRequestDto);
        return authenticateAndRespond(response, user);
    }

    public UserResponseDto login(HttpServletResponse response, LoginRequestDto loginRequestDto){
        User user = userRepository.findByUsername(loginRequestDto.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }

        return authenticateAndRespond(response, user);
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

        return userResponseFromUser(user);
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

    public Long getCurrentUserID(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String username=authentication.getName();


        return userRepository.findByUsername(username).map(User::getId)
                .orElseThrow(()->new RuntimeException("User not found"));
    }


    private User createNonAdminUser(AuthRequestDto authRequestDto) throws IOException {
        User.UserBuilder userBuilder = User.builder()
                .username(authRequestDto.username())
                .fullName(authRequestDto.fullname())
                .email(authRequestDto.email())
                .password(passwordEncoder.encode(authRequestDto.password()))
                .role(Role.NONADMIN);


        MultipartFile profilePhoto = authRequestDto.profilePhoto();
        if (profilePhoto != null) {
            if (profilePhoto.getContentType() != null && !profilePhoto.getContentType().startsWith("image/"))
                throw new IllegalArgumentException("Invalid fyle type");

            if (profilePhoto.getSize() > 5_000_000) {
                throw new IllegalArgumentException(("File too large."));
            }

            String filename = UUID.randomUUID() + "-" + profilePhoto.getOriginalFilename();
            Path path = Paths.get("uploads/profile-pictures", filename);
            Files.copy(profilePhoto.getInputStream(), path);
            userBuilder.profilePhoto("profile-pictures/" + filename);
        }

        User user = userBuilder.build();

        NonAdminUser nonAdminUser = new NonAdminUser();
        nonAdminUser.setUser(user);
        user.setNonAdminUser(nonAdminUser);
        nonAdminUserRepository.save(nonAdminUser);
        return user;
    }

    private UserResponseDto authenticateAndRespond(HttpServletResponse response, User user){
        String accessToken = jwtService.generateToken(user.getUsername(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        UserResponseDto userResponseDto = userResponseFromUser(user);

        addTokensToResponse(response, refreshToken, accessToken);
        return userResponseDto;
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

    private UserResponseDto userResponseFromUser(User user){
        return UserResponseDto.builder()
                .fullname(user.getFullName())
                .username(user.getUsername())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole())
                .build();
    }
}
