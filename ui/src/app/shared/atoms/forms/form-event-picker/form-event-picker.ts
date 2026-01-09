import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEventTag } from '../../../../core/models/event-tag.model';
import { EVENT_TAGS } from '../../../../core/data/event-tag.data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-event-picker',
  imports: [CommonModule],
  templateUrl: './form-event-picker.html',
  styleUrl: './form-event-picker.scss'
})
export class FormEventPicker {
  @Input() label: string = "Evento";
  @Output() onTagSelect = new EventEmitter<string>();
  @Input() set selectedTag(value: string) {
    if (value) {
      this.clickedTag = value;
    }
  }

  tagArray: IEventTag[] = EVENT_TAGS;
  clickedTag: string = '';

  selectTag(tagSlug: string) {
    if(this.clickedTag === tagSlug) {
      this.clickedTag = '';
      return
    }

    this.clickedTag = tagSlug;
    this.onTagSelect.emit(this.clickedTag);
  }
}
