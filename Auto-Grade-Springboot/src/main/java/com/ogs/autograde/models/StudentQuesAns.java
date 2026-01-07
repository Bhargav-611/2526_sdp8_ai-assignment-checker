package com.ogs.autograde.models;


import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class StudentQuesAns extends BaseModel{

    private String answer;

    private int answer_mark;

    private float accuracy_ocr;

    private float accuracy_cmp;

    @Column(nullable = false)
    private String question;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private Image photo;

    @ManyToOne()
    @JoinColumn(name = "sqa_stu_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "sqa_fqa_id")
    private FacultyQuesAns facultyQuesAns;


}
