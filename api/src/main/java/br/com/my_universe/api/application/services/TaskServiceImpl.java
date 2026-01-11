package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.exceptions.BusinessException;
import br.com.my_universe.api.application.ports.TaskRepository;
import br.com.my_universe.api.domain.Task;
import br.com.my_universe.api.domain.enums.TaskType;
import br.com.my_universe.api.infrastructure.web.dto.Task.TaskRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    @Transactional
    public Task createTask(TaskRequest request, String studentEmail) {
        LocalDateTime[] dateTimes = parseAndValidateDates(request);
        LocalDateTime startDateTime = dateTimes[0];
        LocalDateTime endDateTime = dateTimes[1];

        if (taskRepository.hasTimeConflict(studentEmail, startDateTime, endDateTime)) {
            throw new BusinessException("Já existe uma tarefa ou aula agendada neste horário.");
        }
        
        Task task = new Task();
        task.setStudentEmail(studentEmail);
        fillTaskData(task, request, startDateTime, endDateTime);
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Task updateTask(Integer id, TaskRequest request, String studentEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Tarefa não encontrada."));

        if (!task.getStudentEmail().equals(studentEmail)) {
            throw new BusinessException("Você não tem permissão para editar esta tarefa.");
        }

        LocalDateTime[] dateTimes = parseAndValidateDates(request);
        LocalDateTime startDateTime = dateTimes[0];
        LocalDateTime endDateTime = dateTimes[1];

        if (taskRepository.hasTimeConflict(studentEmail, startDateTime, endDateTime, id)) {
            throw new BusinessException("Já existe uma tarefa ou aula agendada neste horário.");
        }

        fillTaskData(task, request, startDateTime, endDateTime);

        taskRepository.update(task);

        return task;
    }

    @Override
    @Transactional
    public void deleteTask(Integer id, String studentEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Tarefa não encontrada."));

        if (!task.getStudentEmail().equals(studentEmail)) {
            throw new BusinessException("Você não tem permissão para excluir esta tarefa.");
        }

        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getTasksByMonth(String studentEmail, int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        return taskRepository.findByMonth(studentEmail, startOfMonth, endOfMonth);
    }

    private LocalDateTime[] parseAndValidateDates(TaskRequest request) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        LocalDate date;
        LocalTime startTime;
        LocalTime endTime;

        try {
            date = LocalDate.parse(request.getDate(), dateFormatter);
            startTime = LocalTime.parse(request.getStartTime(), timeFormatter);
            endTime = LocalTime.parse(request.getEndTime(), timeFormatter);
        } catch (Exception e) {
            throw new BusinessException("Formato de data ou hora inválido. Use dd/MM/yyyy e HH:mm.");
        }

        LocalDateTime startDateTime = LocalDateTime.of(date, startTime);
        LocalDateTime endDateTime = LocalDateTime.of(date, endTime);

        if (endDateTime.isBefore(startDateTime) || endDateTime.isEqual(startDateTime)) {
            throw new BusinessException("A hora de término deve ser posterior à hora de início.");
        }

        return new LocalDateTime[]{startDateTime, endDateTime};
    }

    private void fillTaskData(Task task, TaskRequest request, LocalDateTime start, LocalDateTime end) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStartDate(start);
        task.setEndDate(end);

        String tagSlug = request.getTag() != null ? request.getTag().toLowerCase() : "";
        switch (tagSlug) {
            case "test":
                task.setTaskType(TaskType.PROVA);
                break;
            case "work":
                task.setTaskType(TaskType.TRABALHO);
                break;
            case "task":
                task.setTaskType(TaskType.ATIVIDADE);
                break;
            case "others":
            default:
                task.setTaskType(TaskType.OUTROS);
                break;
        }

        if (request.getSubjectCode() != null && !request.getSubjectCode().isBlank()) {
            task.setSubjectCode(request.getSubjectCode());
        } else {
            task.setSubjectCode(null);
        }
    }
}