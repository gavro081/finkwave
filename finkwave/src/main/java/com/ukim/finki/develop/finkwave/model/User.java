package com.ukim.finki.develop.finkwave.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "full_name", nullable = false, length = Integer.MAX_VALUE)
    private String fullName;

    @Column(name = "email", nullable = false, length = Integer.MAX_VALUE)
    private String email;

    @Column(name = "password", nullable = false, length = Integer.MAX_VALUE)
    @JsonIgnore
    private String password;

    @Column(name = "username", nullable = false, length = Integer.MAX_VALUE)
    private String username;

    @Column(name = "profile_photo", length = Integer.MAX_VALUE)
    private String profilePhoto;

    @OneToOne(mappedBy = "users")
    @JsonIgnore
    private Admin admin;

    @OneToOne(mappedBy = "users")
    @JsonIgnore
    private NonAdminUser nonAdminUser;

}
