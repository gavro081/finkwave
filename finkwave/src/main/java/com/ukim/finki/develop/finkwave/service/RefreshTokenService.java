package com.ukim.finki.develop.finkwave.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ukim.finki.develop.finkwave.config.AuthProperties;
import com.ukim.finki.develop.finkwave.exceptions.InvalidTokenException;
import com.ukim.finki.develop.finkwave.model.RefreshToken;
import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthProperties authProperties;

    public RefreshToken createRefreshToken(User user){
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(Instant.now().plus(authProperties.getRefreshTokenMaxAge(), ChronoUnit.SECONDS));
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken validateRefreshToken(String token){
        RefreshToken refreshToken = findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token."));
        if (refreshToken.isRevoked()){
            throw new InvalidTokenException("Refresh token has been revoked.");
        }
        if (refreshToken.getExpiresAt().isBefore(Instant.now())){
            throw new InvalidTokenException("Refresh token has expired.");
        }
        return refreshToken;
    }

    public void revokeToken(String token){
        findByToken(token).ifPresent(t -> {
            t.setRevoked(true);
            refreshTokenRepository.save(t);
        });
    }

}
