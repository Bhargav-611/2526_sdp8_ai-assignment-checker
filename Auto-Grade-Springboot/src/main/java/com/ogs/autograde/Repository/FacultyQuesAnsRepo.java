package com.ogs.autograde.Repository;

import com.ogs.autograde.models.FacultyQuesAns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyQuesAnsRepo extends JpaRepository<FacultyQuesAns,Long> {
}
