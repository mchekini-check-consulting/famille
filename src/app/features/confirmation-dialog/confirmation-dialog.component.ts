import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  title: string
  content: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { title: string, content: string }
  ) {
    this.title = data.title
    this.content = data.content
  }
}
