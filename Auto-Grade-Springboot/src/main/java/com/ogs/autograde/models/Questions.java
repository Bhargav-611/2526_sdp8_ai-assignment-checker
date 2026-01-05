package com.ogs.autograde.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@Entity
public class Questions {

//    @ToString.Exclude
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answer;

    private String question;

    @Lob
    private byte[] photo;

    public Questions(Long id, String answer,String question, byte[] photo) {
        this.id = id;
        this.answer = answer;
        this.photo = photo;
        this.question = question;
    }
}
