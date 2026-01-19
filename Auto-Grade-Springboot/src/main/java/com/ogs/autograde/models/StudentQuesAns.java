package com.ogs.autograde.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Column(length = 5000)
    private String answer;

    private float answer_mark;
    private float facultyMarks;

    private float accuracy_ocr;

    private float accuracy_cmp;

    @Column(nullable = true)
    private String question;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private Image photo;

    @Column(length = 1000)
    private String evolution;

    @ManyToOne
    @JoinColumn(name = "sqa_stu_id")
    @JsonIgnore
    private Student student;

    @ManyToOne
    @JoinColumn(name = "sqa_fqa_id")
    @JsonIgnore
    private FacultyQuesAns facultyQuesAns;

    @JsonProperty("studentId")
    public Long getStudentId()
    {
        return student != null ? student.getId() : null;
    }

    @JsonProperty("questionId")
    public Long getQuestionId()
    {
        return facultyQuesAns != null ? facultyQuesAns.getId() : null;
    }

}
