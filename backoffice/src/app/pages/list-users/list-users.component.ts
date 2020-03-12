//#region Imports

import { Component } from '@angular/core';

import { DialogLoadingService } from '../../components/dialog-loading/dialog.loading.service';
import { DialogYesnoService } from '../../components/dialog-yesno/dialog.yesno.service';
import { UserProxy } from '../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../services/http-async/http-async.service';
import { PaginationHttpShared } from '../../shared/pagination/pagination.http.shared';

//#endregion

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent extends PaginationHttpShared<UserProxy> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    loading: DialogLoadingService,
    dialogYesNo: DialogYesnoService,
    http: HttpAsyncService,
  ) {
    super(loading, dialogYesNo, http,
      '/users',
      ['email', 'createdAt', 'actions'],
      ['email', 'createdAt', 'roles', 'isActive'],
      async search => (
        [
          {
            email: { $contL: '' },
          },
          {
            $or: [
              { email: { $eq: search || 0 }, },
            ],
          },
        ]),
    );
  }

  //#endregion

}
