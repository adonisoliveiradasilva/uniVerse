import { Component, inject, Input } from '@angular/core';
import { FormInput } from '../../../../atoms/forms/form-input/form-input';
import { FormSelect } from '../../../../atoms/forms/form-select/form-select';
import { FormTimePicker } from '../../../../atoms/forms/form-time-picker/form-time-picker';
import { Button } from '../../../../atoms/buttons/button/button';
import { IButtonMenuOption } from '../../../../../core/models/button-menu-option.model';
import { ScheduleService } from '../../../../../services/rxjs/schedule-service/schedule-service';
import { ComponentState } from '../../../../../templates/component-tasks/component-tasks';
import { FormEventPicker } from '../../../../atoms/forms/form-event-picker/form-event-picker';

@Component({
  selector: 'app-new-task-state',
  imports: [FormInput, FormSelect, FormTimePicker, Button, FormEventPicker],
  templateUrl: './new-task-state.html',
  styleUrl: './new-task-state.scss'
})
export class NewTaskState {
  @Input() subjectOptions: IButtonMenuOption[] = [];

  public _scheduleService = inject(ScheduleService);

  changeState(newState: ComponentState) {
    this._scheduleService.changeState(newState);
  }
}
