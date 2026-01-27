package com.ukim.finki.develop.finkwave.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ukim.finki.develop.finkwave.config.AuthProperties;
import com.ukim.finki.develop.finkwave.exceptions.InvalidTokenException;
import com.ukim.finki.develop.finkwave.exceptions.UnauthenticatedException;
import com.ukim.finki.develop.finkwave.model.dto.AuthRequestDto;
import com.ukim.finki.develop.finkwave.model.dto.LoginRequestDto;
import com.ukim.finki.develop.finkwave.model.dto.UserResponseDto;
import com.ukim.finki.develop.finkwave.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthProperties authProperties;
    private final AuthService authService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> register(
            @ModelAttribute AuthRequestDto authRequestDto,
            HttpServletResponse httpServletResponse) throws IOException {
        UserResponseDto userResponseDto = authService.registerAndLogIn(httpServletResponse, authRequestDto);
        return ResponseEntity.ok(Map.of(
                "user", userResponseDto,
                "tokenExpiresIn", authProperties.getAccessTokenMaxAge()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequestDto loginRequestDto,
            HttpServletResponse httpServletResponse) {
        UserResponseDto userResponseDto = authService.login(httpServletResponse, loginRequestDto);
        return ResponseEntity.ok(Map.of(
                "user", userResponseDto,
                "tokenExpiresIn", authProperties.getAccessTokenMaxAge()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Integer>> refresh(
            HttpServletResponse httpServletResponse,
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            throw new InvalidTokenException("No refresh token provided.");
        }
        authService.refreshAccessTokenAndAddCookie(httpServletResponse, refreshToken);
        return ResponseEntity.ok(Map.of(
                "tokenExpiresIn", authProperties.getAccessTokenMaxAge()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletResponse httpServletResponse,
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        authService.clearCookies(httpServletResponse, refreshToken);
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Successful log out"));
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthenticatedException();
        }
        Object principal = authentication.getPrincipal();
        String username = principal instanceof UserDetails userDetails
                ? userDetails.getUsername()
                : (principal != null ? principal.toString() : "");
        UserResponseDto userDto = authService.getUserDtoByUsername(username);
        return ResponseEntity.ok(Map.of(
                "tokenExpiresIn", authProperties.getAccessTokenMaxAge(),
                "user", userDto
        ));
    }

}
