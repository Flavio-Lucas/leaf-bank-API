import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
