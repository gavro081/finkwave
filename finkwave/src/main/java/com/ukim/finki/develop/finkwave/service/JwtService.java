package com.ukim.finki.develop.finkwave.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    // todo: read from config
    private final int accessTokenMaxAge = 900; // 900s - 15min
    // todo: replace hardcoded secret
    private final String secretKey = "very-really-extremely-secret-key-123";

    public String generateToken(String username, String role){
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(username)
                .claim("role", "ROLE_" + role)
                .setExpiration(new Date(System.currentTimeMillis() + (long) accessTokenMaxAge * 1000))
                .signWith(key)
                .compact();
    }

    public Claims extractClaims(String token){
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
