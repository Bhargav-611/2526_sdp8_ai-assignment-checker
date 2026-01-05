package com.ogs.autograde.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class QuestionsResponse {
    private String answer;
    private String question;
    private String photoUrl;

    public QuestionsResponse(String question,String answer, String photoUrl) {
        this.answer = answer;
        this.photoUrl = photoUrl;
        this.question = question;

    }
}
