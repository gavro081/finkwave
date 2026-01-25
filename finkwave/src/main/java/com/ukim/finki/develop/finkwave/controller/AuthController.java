package com.ukim.finki.develop.finkwave.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ukim.finki.develop.finkwave.dto.AuthRequestDto;
import com.ukim.finki.develop.finkwave.dto.AuthResponseDto;
import com.ukim.finki.develop.finkwave.dto.LoginRequestDto;
import com.ukim.finki.develop.finkwave.dto.UserResponseDto;
import com.ukim.finki.develop.finkwave.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    // todo: read from config
    private final int accessTokenMaxAge = 900;
    private final int refreshTokenMaxAge = 10 * 24 * 60 * 60;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestBody AuthRequestDto authRequestDto,
            HttpServletResponse httpServletResponse){
        try {
            AuthResponseDto authResponse = authService.registerAndLogIn(authRequestDto);
            addTokensToResponse(httpServletResponse, authResponse);
            return ResponseEntity.ok(Map.of(
                    "user", authResponse.userResponseDto(),
                    "tokenExpiresIn", accessTokenMaxAge
            ));
        } catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequestDto loginRequestDto,
            HttpServletResponse httpServletResponse){
        try {
            AuthResponseDto authResponse = authService.login(loginRequestDto.username(), loginRequestDto.password());
            addTokensToResponse(httpServletResponse, authResponse);
            return ResponseEntity.ok(Map.of(
                    "user", authResponse.userResponseDto(),
                    "tokenExpiresIn", accessTokenMaxAge
                    )
            );
        } catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Integer>> refresh(
            HttpServletResponse httpServletResponse,
            @CookieValue(name = "refreshToken", required = false) String refreshToken){
        if (refreshToken == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No credentials");
        }
        authService.refreshAccessTokenAndAddCookie(httpServletResponse, refreshToken);
        return ResponseEntity.ok(Map.of(
                "tokenExpiresIn", accessTokenMaxAge
        ));
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletResponse httpServletResponse,
            @CookieValue(name = "refreshToken", required = false) String refreshToken){
        clearCookies(httpServletResponse, refreshToken);
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Successful log out"));
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        Object principal = authentication.getPrincipal();
        String username = principal instanceof UserDetails userDetails
                ? userDetails.getUsername()
                : (principal != null ? principal.toString() : "");
        UserResponseDto userDto = authService.getUserDtoByUsername(username);
        return ResponseEntity.ok(Map.of(
                "tokenExpiresIn", accessTokenMaxAge,
                "user", userDto
        ));
    }

    private void clearCookies(HttpServletResponse httpServletResponse, String refreshToken) {
        if (refreshToken != null){
            authService.invalidateRefreshToken(refreshToken);
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

        authService.addAccessCookieToResponse(response, authResponse.accessToken());
    }
}
