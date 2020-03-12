import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { DialogYesnoComponent } from './dialog.yesno.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [
    DialogYesnoComponent,
  ],
  entryComponents: [
    DialogYesnoComponent,
  ],
})

export class DialogYesnoModule {}
