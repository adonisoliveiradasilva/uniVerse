import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { ScheduleService } from '../../services/rxjs/schedule-service/schedule-service';
import { ComponentState } from '../component-tasks/component-tasks';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../shared/atoms/forms/form-input/form-input';
import { FormSelect } from '../../shared/atoms/forms/form-select/form-select';
import { SubjectService } from '../../services/api/subject-service/subject-service';
import { finalize, map, Subscription, take } from 'rxjs';
import { ISubject } from '../../core/models/entitys/ISubject.model';
import { IButtonMenuOption } from '../../core/models/button-menu-option.model';
import { AlertService } from '../../services/rxjs/alert-service/alert-service';
import { FormTimePicker } from '../../shared/atoms/forms/form-time-picker/form-time-picker';
import { format } from 'date-fns';

@Component({
  selector: 'app-form-calendar-template',
  imports: [CommonModule, FormInput, FormSelect, FormTimePicker],
  templateUrl: './form-calendar-template.html',
  styleUrl: './form-calendar-template.scss'
})
export class FormCalendarTemplate {
  public _scheduleService = inject(ScheduleService);
    
  private _subjectService = inject(SubjectService);
  private _cdr = inject(ChangeDetectorRef);
  private _alertService = inject(AlertService);
  
  private subscription: Subscription = new Subscription();

  subjectOptions: IButtonMenuOption[] = [];
  isLoading: boolean = false;

  changeState(newState: ComponentState) {
    this._scheduleService.changeState(newState);
  }

  ngOnInit() {
    this._loadAvailableSubjects();
    this._listenToSelectedDate();
  }

  private _loadAvailableSubjects() {
    this.isLoading = true;
    this._subjectService.getAvailableSubjects().pipe(
      take(1),
      map((subjects: ISubject[]) => 
        subjects.map((subject, index) => ({
          id: index,
          label: subject.code
        }))
      ),
      finalize(() => {
        this.isLoading = false;
        this._cdr.detectChanges();
      })
    ).subscribe({
      next: (options) => {
        this.subjectOptions = options;
        if (options.length === 0) {
            this._alertService.warn("Você não possui disciplinas disponíveis para vincular.");
        }
      },
      error: () => this._alertService.error("Erro ao carregar disciplinas disponíveis.")
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private _listenToSelectedDate() {
    const sub = this._scheduleService.selectedDayState$
      .subscribe(selectedDate => {
        if (selectedDate) {
          const formatedDate = format(selectedDate, 'dd/MM/yyyy');
          console.log('Data selecionada (Reativo):', formatedDate);
        }
      });
    
    this.subscription.add(sub);
  }
}
