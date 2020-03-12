import { NgModule } from '@angular/core';
import { MatDialogModule, MatProgressSpinnerModule } from '@angular/material';

import { DialogLoadingComponent } from './dialog.loading.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    DialogLoadingComponent,
  ],
  entryComponents: [
    DialogLoadingComponent,
  ],
})

export class DialogLoadingModule {}
