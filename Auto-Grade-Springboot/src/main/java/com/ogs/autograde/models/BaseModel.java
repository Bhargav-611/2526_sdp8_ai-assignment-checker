package com.ogs.autograde.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @CreatedDate // this annotation tells spring that only handles for creat obj.
    protected Date createdAt;

    @Column(nullable = false)
    @LastModifiedDate // this annotation tells spring that only handle for Last update obj.
    protected Date updatedAt;
}