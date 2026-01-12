package com.ogs.autograde.payloads;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateFacultyDto {
    private String name;
}
