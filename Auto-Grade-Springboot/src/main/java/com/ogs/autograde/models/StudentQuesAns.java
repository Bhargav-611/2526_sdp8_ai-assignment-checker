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
    private String answer;          // raw OCR text

    @Column(length = 5000)
    private String answerClean;     // grammar-corrected by AI pipeline

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sqa_stu_id")
    @JsonIgnore
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sqa_fqa_id")
    @JsonIgnore
    private FacultyQuesAns facultyQuesAns;

    // ── expose student details in JSON ──────────────────────
    @JsonProperty("studentId")
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }

    @JsonProperty("studentName")
    public String getStudentName() {
        return student != null ? student.getName() : null;
    }

    @JsonProperty("studentRollNumber")
    public String getStudentRollNumber() {
        return student != null ? student.getRollNumber() : null;
    }

    @JsonProperty("studentEmail")
    public String getStudentEmail() {
        return student != null ? student.getEmail() : null;
    }

    @JsonProperty("studentSemester")
    public String getStudentSemester() {
        return student != null ? student.getSemester() : null;
    }

    // ── expose question details in JSON ─────────────────────
    @JsonProperty("questionId")
    public Long getQuestionId() {
        return facultyQuesAns != null ? facultyQuesAns.getId() : null;
    }

    @JsonProperty("questionText")
    public String getQuestionText() {
        return facultyQuesAns != null ? facultyQuesAns.getQuestion() : null;
    }

    @JsonProperty("maxMarks")
    public Integer getMaxMarks() {
        return facultyQuesAns != null ? facultyQuesAns.getMax_mark() : null;
    }

    @JsonProperty("modelAnswer")
    public String getModelAnswer() {
        return facultyQuesAns != null ? facultyQuesAns.getAnswer() : null;
    }

}
