package com.ukim.finki.develop.finkwave.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @Column(name = "user_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_seq")
    private Long id;

    @Column(name = "full_name", nullable = false, length = Integer.MAX_VALUE)
    private String fullName;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    private String email;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    @JsonIgnore
    private String password;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    private String username;

    @Column(name = "profile_photo", length = Integer.MAX_VALUE)
    private String profilePhoto;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Admin admin;

    // todo: is this column needed? if so, add to entities and documentation
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private NonAdminUser nonAdminUser;

}
