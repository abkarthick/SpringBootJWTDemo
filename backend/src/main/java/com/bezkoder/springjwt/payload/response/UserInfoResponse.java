package com.bezkoder.springjwt.payload.response;

import java.util.Set;

public class UserInfoResponse {
  private Long id;
  private String username;
  private String email;
  private Set<String> roles;

  public UserInfoResponse(Long id, String username, String email, Set<String> roles) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }

  public Long getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getEmail() {
    return email;
  }

  public Set<String> getRoles() {
    return roles;
  }
}
