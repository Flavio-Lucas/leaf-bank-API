import { Routes } from '@angular/router';

import { ListUsersComponent } from '../../pages/list-users/list-users.component';
import { CreateUserComponent } from '../../pages/user/create-user.component';
import { UpdateUserComponent } from '../../pages/user/update-user.component';

export const AdminLayoutRoutes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: ListUsersComponent },
  { path: 'users/create', component: CreateUserComponent },
  { path: 'users/:entityId', component: UpdateUserComponent },
];
