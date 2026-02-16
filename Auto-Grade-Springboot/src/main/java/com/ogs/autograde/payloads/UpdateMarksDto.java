package com.ogs.autograde.payloads;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMarksDto {
    private Long studentQuesAnsId;
    private Integer answer_mark;
    private String evolution; // feedback
}
