//#region Imports

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogLoadingService } from '../../components/dialog-loading/dialog.loading.service';
import { HttpAsyncService } from '../../services/http-async/http-async.service';
import { getCrudErrors } from '../../utils/functions';
import { JqueryHelper } from '../../utils/jquery';
import { BaseUserComponent } from './base-user.component';

//#endregion

@Component({
  selector: 'app-create-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class CreateUserComponent extends BaseUserComponent {

  //#region Construtor

  /**
   * Construtor padrão
   */
  constructor(
    protected router: Router,
    loading: DialogLoadingService,
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    http: HttpAsyncService,
  ) {
    super(loading, formBuilder, route, http);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que é chamado ao tentar cadastrar uma postagem
   */
  public async onSubmit(): Promise<void> {
    this.loading.open();

    const payload = this.formGroup.getRawValue();
    const { error } = await this.http.post(`/users`, payload);

    this.loading.close();

    if (error)
      return JqueryHelper.error(getCrudErrors(error)[0]);

    JqueryHelper.success('Usuário criado com sucesso!');

    await this.router.navigateByUrl(`/dashboard/users`);
  }

  //#endregion

}
