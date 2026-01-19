package com.ukim.finki.develop.finkwave.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @Column(name = "user_id", nullable = false)
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

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private NonAdminUser nonAdminUser;

}
