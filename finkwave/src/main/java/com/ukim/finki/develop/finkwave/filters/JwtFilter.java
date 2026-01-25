package com.ukim.finki.develop.finkwave.filters;

import com.ukim.finki.develop.finkwave.service.CustomUserDetailsService;
import com.ukim.finki.develop.finkwave.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpStatus;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        String token = null;
        if (request.getCookies() != null){
            for (Cookie cookie: request.getCookies()){
                if ("accessToken".equals(cookie.getName())){
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token != null && !token.isEmpty()){
            try {
                Claims claims = jwtService.extractClaims(token);
                String username = claims.getSubject();
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (ExpiredJwtException e){
                System.out.println("Expired jwt token.");
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                return;
            } catch (JwtException e){
                System.out.println("Invalid jwt token.");
                return;
            } catch (Exception e){
                System.out.println(e.getMessage());
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
