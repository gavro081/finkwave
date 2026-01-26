package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.config.AuthProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final AuthProperties authProperties;

    public String generateToken(String username, String role){
        SecretKey key = Keys.hmacShaKeyFor(authProperties.getSecret().getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(username)
                .claim("role", "ROLE_" + role)
                .setExpiration(new Date(System.currentTimeMillis() + (long) authProperties.getAccessTokenMaxAge() * 1000))
                .signWith(key)
                .compact();
    }

    public Claims extractClaims(String token){
        SecretKey key = Keys.hmacShaKeyFor(authProperties.getSecret().getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
