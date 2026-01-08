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

@Component({
  selector: 'app-new-task-state',
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormSelect, FormTimePicker, Button, FormEventPicker],
  templateUrl: './new-task-state.html',
  styleUrl: './new-task-state.scss'
})
export class NewTaskState implements OnInit, OnDestroy {
  @Input() subjectOptions: IButtonMenuOption[] = [];

  public _scheduleService = inject(ScheduleService);
  private _fb = inject(FormBuilder);
  private _alertService = inject(AlertService);
  private _taskService = inject(TaskService);
  
  form!: FormGroup;
  selectedDate: Date | null = null;
  private _sub = new Subscription();

  ngOnInit() {
    this.form = this._fb.group({
      title: ['', [Validators.required]],
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

      if (!title) {
        this._alertService.warn("O título da tarefa é obrigatório.");
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

    console.log(payload.tag)

    this._taskService.createTask(payload).subscribe({
        next: (res) => {
          this._alertService.success("Tarefa criada com sucesso!");
          this.changeState('view_tasks'); 
          // recarregar aqui o calendario
        },
        error: (err) => {
          console.error('Erro da API:', err);
          
          let msg = err.error?.message;
          
          if (!msg) {
            msg = "Ocorreu um erro ao salvar a tarefa.";
          }

          if (err.status === 403) {
            msg = "Acesso negado. Verifique sua sessão.";
          }

          this._alertService.error(msg);
        }
    });
  }

  changeState(newState: ComponentState) {
    this._scheduleService.changeState(newState);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}