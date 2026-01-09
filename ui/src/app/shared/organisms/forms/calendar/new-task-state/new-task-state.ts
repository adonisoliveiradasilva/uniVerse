import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../../atoms/forms/form-input/form-input';
import { FormSelect } from '../../../../atoms/forms/form-select/form-select';
import { FormTimePicker } from '../../../../atoms/forms/form-time-picker/form-time-picker';
import { Button } from '../../../../atoms/buttons/button/button';
import { FormEventPicker } from '../../../../atoms/forms/form-event-picker/form-event-picker';
import { IButtonMenuOption } from '../../../../../core/models/button-menu-option.model';
import { ScheduleService } from '../../../../../services/rxjs/schedule-service/schedule-service';
import { ComponentState } from '../../../../../templates/component-tasks/component-tasks';
import { AlertService } from '../../../../../services/rxjs/alert-service/alert-service';
import { format } from 'date-fns';
import { TaskService } from '../../../../../services/api/task-service/task-service';
import { FormModal } from '../../../../../services/rxjs/form-modal-service/form-modal-service';
import { TableContextEnum } from '../../../../../core/types/table-context.type';

@Component({
  selector: 'app-new-task-state',
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormSelect, FormTimePicker, Button, FormEventPicker],
  templateUrl: './new-task-state.html',
  styleUrl: './new-task-state.scss'
})
export class NewTaskState implements OnInit, OnDestroy {
  @Input() subjectOptions: IButtonMenuOption[] = [];
  @Input() isEditMode: boolean = false;

  public _scheduleService = inject(ScheduleService);
  private _fb = inject(FormBuilder);
  private _alertService = inject(AlertService);
  private _taskService = inject(TaskService);
  private _formModalService = inject(FormModal);
  
  form!: FormGroup;
  selectedDate: Date | null = null;
  private _sub = new Subscription();
  taskId: number | null = null;

  ngOnInit() {
    this.form = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subject: [null],
      description: [''],
      tag: [''],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]]
    });

    this._sub.add(
      this._scheduleService.selectedDayState$.subscribe(date => {
        this.selectedDate = date;
      })
    );

    if (this.isEditMode) {
        this._loadTaskData();
    }
  }

  updateTag(tagSlug: string) {
    this.form.patchValue({ tag: tagSlug });
  }

  updateTime(times: { start: string, end: string }) {
    this.form.patchValue({
      startTime: times.start,
      endTime: times.end
    });

    if (this.form.get('endTime')?.hasError('invalidTime')) {
      this.form.get('endTime')?.setErrors(null);
    }
  }

  save() {
    if (!this.selectedDate) {
      this._alertService.warn("Nenhuma data selecionada no calendário.");
      return;
    }

    const { title, startTime, endTime } = this.form.value;

    if (startTime && endTime && endTime <= startTime) {
      this._alertService.warn("A hora de término deve ser posterior à hora de início.");
      this.form.get('endTime')?.setErrors({ invalidTime: true });
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const titleControl = this.form.get('title');

      if (!title) {
        this._alertService.warn("O título da tarefa é obrigatório.");
      } else if (titleControl?.hasError('minlength')) {
        this._alertService.warn("O título deve ter no mínimo 3 caracteres.");
      } else if (!startTime || !endTime) {
        this._alertService.warn("Os horários de início e fim são obrigatórios.");
      } else {
        this._alertService.warn("Verifique os campos em vermelho.");
      }
      return;
    }

    let formatedDate = 'dd/MM/yyyy';
    if (this.selectedDate) {
      formatedDate = format(this.selectedDate, 'dd/MM/yyyy');
    }

    const formValue = this.form.value;

    const payload = {
      title: formValue.title,
      description: formValue.description,
      subjectCode: formValue.subject,
      tag: formValue.tag ? formValue.tag : 'OUTROS',
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      date: formatedDate
    };

    if (this.isEditMode && this.taskId) {
        this._taskService.updateTask(this.taskId, payload).subscribe({
            next: () => {
                this._alertService.success("Tarefa atualizada com sucesso!");
                this._scheduleService.notifyCalendarRefresh();
                this.changeState('view_tasks');
            },
            error: (err) => this._handleError(err)
        });

    } else {
        this._taskService.createTask(payload).subscribe({
            next: () => {
                this._alertService.success("Tarefa criada com sucesso!");
                this._scheduleService.notifyCalendarRefresh();
                this.changeState('view_tasks'); 
            },
            error: (err) => this._handleError(err)
        });
    }
  }

  changeState(newState: ComponentState) {
    this._scheduleService.changeState(newState);
  }

  delete() {
    if (!this.taskId) return;

    const taskTitle = this.form.get('title')?.value || 'Tarefa';

    this._formModalService.openModal(
        TableContextEnum.Tasks,
        'delete',               
        this.taskId.toString(), 
        taskTitle               
    );
  }

  private _loadTaskData() {
    this._sub.add(
        this._scheduleService.taskToEdit$.subscribe(task => {
            if (task) {
                this.taskId = task.id;
                
                const start = new Date(task.startDate);
                const end = new Date(task.endDate);
                
                const tagSlug = this._mapBackendTypeToSlug(task.taskType);

                this.form.patchValue({
                    title: task.title,
                    description: task.description,
                    subject: task.subjectCode,
                    tag: tagSlug,
                    startTime: format(start, 'HH:mm'),
                    endTime: format(end, 'HH:mm')
                });
            }
        })
    );
  }

  private _mapBackendTypeToSlug(type: string): string {
      switch (type) {
          case 'PROVA': return 'test';
          case 'TRABALHO': return 'work';
          case 'ATIVIDADE': 
          case 'ESTUDO': return 'task';
          default: return 'others';
      }
  }

  private _handleError(err: any) {
    console.error('Erro da API:', err);
    let msg = err.error?.message || "Ocorreu um erro ao processar a tarefa.";
    if (err.status === 403) msg = "Acesso negado.";
    this._alertService.error(msg);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  
}