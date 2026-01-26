package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cascade;

@Getter
@Setter
@Entity
@Table(name = "non_admin_users", schema = "project")
public class NonAdminUser {
    @Id
    @Column(name = "user_id", nullable = false)
    private Long id;

    @MapsId
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "user_id")
    private User user;

}