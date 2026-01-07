import { Component, Input } from '@angular/core';
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

  tagArray: IEventTag[] = EVENT_TAGS;
  clickedTag = this.tagArray[1].slug;

  selectTag(tagSlug: string) {
    if(this.clickedTag === tagSlug) {
      this.clickedTag = '';
      return
    }

    this.clickedTag = tagSlug;
  }
}
