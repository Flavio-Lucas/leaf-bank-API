import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { DialogYesnoReasonComponent } from './dialog.yesno-reason.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  declarations: [
    DialogYesnoReasonComponent,
  ],
  entryComponents: [
    DialogYesnoReasonComponent,
  ],
})

export class DialogYesnoReasonModule {}
