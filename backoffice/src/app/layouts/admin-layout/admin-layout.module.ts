import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatPaginatorIntl, MatPaginatorModule, MatProgressSpinnerModule, MatRippleModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

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
    AngularFireStorageModule,
    DialogYesnoModule,
    DialogLoadingModule,
    DialogYesnoReasonModule,
    MatExpansionModule,
    CKEditorModule,
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
