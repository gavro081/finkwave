package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class FollowId implements Serializable {
    private static final long serialVersionUID = -915670330063692538L;
    @Column(name = "follower", nullable = false)
    private Long follower;

    @Column(name = "followee", nullable = false)
    private Long followee;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        FollowId entity = (FollowId) o;
        return Objects.equals(this.follower, entity.follower) &&
                Objects.equals(this.followee, entity.followee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(follower, followee);
    }

}