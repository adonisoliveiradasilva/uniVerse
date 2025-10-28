package br.com.my_universe.api.application.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.my_universe.api.application.exceptions.ResourceAlreadyExistsException;
import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.CourseRepository;
import br.com.my_universe.api.application.ports.InstitutionRepository;
import br.com.my_universe.api.application.ports.CourseSubjectRepository;
import br.com.my_universe.api.domain.Course;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseServiceImpl {
    private final CourseRepository courseRepository;
    private final InstitutionRepository institutionRepository;
    private final CourseSubjectRepository courseSubjectRepository;

    public CourseServiceImpl(CourseRepository courseRepository, 
                             InstitutionRepository institutionRepository,
                             CourseSubjectRepository courseSubjectRepository) { // 4. ATUALIZAR CONSTRUTOR
        this.courseRepository = courseRepository;
        this.institutionRepository = institutionRepository;
        this.courseSubjectRepository = courseSubjectRepository;
    }
    
    @Transactional
    public Course createCourse(Course course, List<String> subjectsIds) {
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
            .orElseThrow(() -> new ResourceNotFoundException("Instituição com sigla '" + course.getInstitutionAcronym() + "' não encontrada."));

        courseRepository.findByCodeAndInstitutionAcronym(course.getCode(), course.getInstitutionAcronym())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Disciplina com código '" + course.getCode() + "' já existe para a instituição '" + course.getInstitutionAcronym() + "'.");
            });


        Course savedCourse = courseRepository.save(course);

        if (subjectsIds != null && !subjectsIds.isEmpty()) {
            courseSubjectRepository.linkSubjectsToCourse(
                savedCourse.getInstitutionAcronym(), 
                savedCourse.getCode(), 
                subjectsIds
            );
            savedCourse.setSubjectCodes(subjectsIds); 
        }

        return savedCourse;
    }

    @Transactional
    public Course updateCourse(String originalCode, String originalAcronym, Course courseDetails, List<String> subjectsIds) {
        Course existingCourse = getCourseByCodeAndAcronym(originalCode, originalAcronym);

        boolean uniqueKeyChanged = !existingCourse.getCode().equals(courseDetails.getCode()) || 
                                   !existingCourse.getInstitutionAcronym().equals(courseDetails.getInstitutionAcronym());

        if (uniqueKeyChanged) {
            courseRepository.findByCodeAndInstitutionAcronym(courseDetails.getCode(), courseDetails.getInstitutionAcronym())
                .ifPresent(s -> {
                    throw new ResourceAlreadyExistsException("Já existe outra disciplina com o código '" + courseDetails.getCode() + "' para a instituição '" + courseDetails.getInstitutionAcronym() + "'.");
                });
        }

        Course updatedCourse = courseRepository.update(originalCode, originalAcronym, courseDetails);
        courseSubjectRepository.unlinkAllSubjectsFromCourse(originalAcronym, originalCode);

        if (subjectsIds != null && !subjectsIds.isEmpty()) {
            courseSubjectRepository.linkSubjectsToCourse(
                updatedCourse.getInstitutionAcronym(), 
                updatedCourse.getCode(), 
                subjectsIds
            );
        }


        updatedCourse.setSubjectCodes(subjectsIds);

        System.out.println(">>> Service: Finalizando update. subjectsIds recebido: " + subjectsIds);
    if (subjectsIds == null) {
         updatedCourse.setSubjectCodes(new ArrayList<>()); // Garante lista vazia, não nula
         System.out.println(">>> Service: Setando subjectCodes como lista VAZIA");
    } else {
         updatedCourse.setSubjectCodes(subjectsIds); // Seta a lista recebida
         System.out.println(">>> Service: Setando subjectCodes como: " + subjectsIds);
    }
    // **** FIM DO LOG ****
        return updatedCourse;    
    }
    
    public Course getCourseByCodeAndAcronym(String code, String acronym) {
        Course course = courseRepository.findByCodeAndInstitutionAcronym(code, acronym)
            .orElseThrow(() -> new ResourceNotFoundException("CURSO com código '" + code + "' e instituição '" + acronym + "' não encontrado."));
        
        List<String> subjectCodes = courseSubjectRepository.findSubjectCodesByCourse(acronym, code);
        course.setSubjectCodes(subjectCodes);
        
        return course;
    }

    public Course deleteCourse(String code, String acronym) {
        Course courseToDelete = getCourseByCodeAndAcronym(code, acronym);
        // O `ON DELETE CASCADE` no banco deve limpar a tabela 'tb_course_subjects'
        courseRepository.deleteByCodeAndInstitutionAcronym(code, acronym);
        return courseToDelete;
    }

    public List<Course> getAllCoursesByInstitution(String institutionAcronym) {
        List<Course> courses = courseRepository.findAllByInstitutionAcronym(institutionAcronym);

        for (Course course : courses) {
            List<String> subjectCodes = courseSubjectRepository.findSubjectCodesByCourse(
                course.getInstitutionAcronym(), 
                course.getCode()
            );
            course.setSubjectCodes(subjectCodes);
        }
        
        return courses;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}
