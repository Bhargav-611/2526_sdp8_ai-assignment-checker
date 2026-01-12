package com.ogs.autograde.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "images")
public class Image extends BaseModel{

    @Column(name = "name_image")
    private String name;

    @Column(name = "url_image")
    private String url;

}