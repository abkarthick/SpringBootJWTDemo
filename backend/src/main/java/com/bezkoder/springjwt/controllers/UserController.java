package com.bezkoder.springjwt.controllers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.response.UserInfoResponse;
import com.bezkoder.springjwt.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @GetMapping
  public ResponseEntity<List<UserInfoResponse>> getAllUsers() {
    List<User> users = userRepository.findAll();

    List<UserInfoResponse> dto = users.stream().map(u -> {
      Set<String> roles = u.getRoles().stream()
          .map(r -> r.getName().name())
          .collect(Collectors.toSet());
      return new UserInfoResponse(u.getId(), u.getUsername(), u.getEmail(), roles);
    }).collect(Collectors.toList());

    return ResponseEntity.ok(dto);
  }
}
