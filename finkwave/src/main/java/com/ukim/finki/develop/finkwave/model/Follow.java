package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "follows", schema = "project")
public class Follow {
    @EmbeddedId
    private FollowId id;

    @MapsId("follower")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "follower", nullable = false)
    private NonAdminUser follower;

    @MapsId("followee")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "followee", nullable = false)
    private NonAdminUser followee;

    public Follow(NonAdminUser follower,NonAdminUser followee){
        this.follower=follower;
        this.followee=followee;
        this.id=new FollowId(follower.getId(),followee.getId());
    }

}