import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { DialogLoadingModule } from '../../components/dialog-loading/dialog.loading.module';
import { DialogYesnoReasonModule } from '../../components/dialog-yesno-reason/dialog.yesno-reason.module';
import { DialogYesnoModule } from '../../components/dialog-yesno/dialog.yesno.module';
import { MatPaginatorIntlBr } from '../../components/material/MatPaginatorIntlBr';
import { ListUsersComponent } from '../../pages/list-users/list-users.component';
import { CreateUserComponent } from '../../pages/user/create-user.component';
import { UpdateUserComponent } from '../../pages/user/update-user.component';
import { AdminLayoutRoutes } from './admin-layout.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    DialogYesnoModule,
    DialogLoadingModule,
    DialogYesnoReasonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatOptionModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  declarations: [
    CreateUserComponent,
    UpdateUserComponent,
    ListUsersComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlBr },
  ],
})

export class AdminLayoutModule {
}
