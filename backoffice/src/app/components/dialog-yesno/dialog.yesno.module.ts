import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

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
