package com.example.demo.security;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

@Component
public class JwtFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;

  public JwtFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);

      Claims claims = jwtUtil.extractClaims(token);
      String role = claims.get("role", String.class);

      if (role != null) {
        var authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
        );
        var auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
      }

      request.setAttribute("userId", Integer.parseInt(claims.getSubject()));
      request.setAttribute("role", claims.get("role"));
    }

    // 🌟 これが正しい位置（if文の外、メソッドの中）に収まりましたにゃ！
    filterChain.doFilter(request, response);
  }
}
