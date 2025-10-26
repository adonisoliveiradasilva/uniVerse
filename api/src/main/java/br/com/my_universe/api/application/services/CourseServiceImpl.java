package br.com.my_universe.api.application.services;

import org.springframework.stereotype.Service;
import br.com.my_universe.api.application.exceptions.ResourceAlreadyExistsException;
import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.CourseRepository;
import br.com.my_universe.api.application.ports.InstitutionRepository;
import br.com.my_universe.api.domain.Course;
import java.util.List;

@Service
public class CourseServiceImpl {
    private final CourseRepository courseRepository;
    private final InstitutionRepository institutionRepository;

    public CourseServiceImpl(CourseRepository courseRepository, InstitutionRepository institutionRepository) {
        this.courseRepository = courseRepository;
        this.institutionRepository = institutionRepository;
    }

    public Course createCourse(Course course) {
        if (course.getCode() == null || course.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("O código (code) da disciplina não pode ser vazio.");
        }

        if (course.getName() == null || course.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome (name) da disciplina não pode ser vazio.");
        }

        if (course.getInstitutionAcronym() == null || course.getInstitutionAcronym().trim().isEmpty()) {
            throw new IllegalArgumentException("A sigla da instituição (institutionAcronym) não pode ser vazia.");
        }

        if (course.getPeriodsQuantity() == null || course.getPeriodsQuantity() <= 0) {
            throw new IllegalArgumentException("A Quantidade de Períodos deve ser um número positivo.");
        }

        institutionRepository.findByAcronym(course.getInstitutionAcronym())
            .orElseThrow(() -> new ResourceNotFoundException("Instituição com sigla '" + course.getInstitutionAcronym() + "' não encontrada. Não é possível criar a disciplina."));

        courseRepository.findByCodeAndInstitutionAcronym(course.getCode(), course.getInstitutionAcronym())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Disciplina com código '" + course.getCode() + "' já existe para a instituição '" + course.getInstitutionAcronym() + "'.");
            });

        institutionRepository.findByAcronym(course.getInstitutionAcronym())
            .orElseThrow(() -> new ResourceNotFoundException("Instituição com sigla '" + course.getInstitutionAcronym() + "' não encontrada."));

        courseRepository.findByCodeAndInstitutionAcronym(course.getCode(), course.getInstitutionAcronym())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Disciplina com código '" + course.getCode() + "' já existe para a instituição '" + course.getInstitutionAcronym() + "'.");
            });

        return courseRepository.save(course);
    }

    public Course updateCourse(String originalCode, String originalAcronym, Course courseDetails) {
        Course existingCourse = getCourseByCodeAndAcronym(originalCode, originalAcronym);

        boolean uniqueKeyChanged = !existingCourse.getCode().equals(courseDetails.getCode()) || 
                                   !existingCourse.getInstitutionAcronym().equals(courseDetails.getInstitutionAcronym());

        if (uniqueKeyChanged) {
            courseRepository.findByCodeAndInstitutionAcronym(courseDetails.getCode(), courseDetails.getInstitutionAcronym())
                .ifPresent(s -> {
                    throw new ResourceAlreadyExistsException("Já existe outra disciplina com o código '" + courseDetails.getCode() + "' para a instituição '" + courseDetails.getInstitutionAcronym() + "'.");
                });
        }
        
        return courseRepository.update(originalCode, originalAcronym, courseDetails);
    }
    
    public Course getCourseByCodeAndAcronym(String code, String acronym) {
        return courseRepository.findByCodeAndInstitutionAcronym(code, acronym)
            .orElseThrow(() -> new ResourceNotFoundException("Disciplina com código '" + code + "' e instituição '" + acronym + "' não encontrada."));
    }

    public Course deleteCourse(String code, String acronym) {
        Course courseToDelete = getCourseByCodeAndAcronym(code, acronym);
        courseRepository.deleteByCodeAndInstitutionAcronym(code, acronym);
        return courseToDelete;
    }

    public List<Course> getAllCoursesByInstitution(String institutionAcronym) {
        return courseRepository.findAllByInstitutionAcronym(institutionAcronym);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}
