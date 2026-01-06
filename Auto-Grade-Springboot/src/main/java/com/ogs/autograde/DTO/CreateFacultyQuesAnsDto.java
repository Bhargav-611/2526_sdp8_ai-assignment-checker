package com.ogs.autograde.DTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CreateFacultyQuesAnsDto {
    private Long faculty_id;
    private String answer;
    private String question;
    private int max_mark;

}
