//#region Imports

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogLoadingService } from '../../components/dialog-loading/dialog.loading.service';
import { UserProxy } from '../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../services/http-async/http-async.service';
import { getCrudErrors } from '../../utils/functions';
import { JqueryHelper } from '../../utils/jquery';
import { BaseUserComponent } from './base-user.component';

//#endregion

@Component({
  selector: 'app-update-sector',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
/**
 * A classe que representa a página para atualizar as informações de uma entidade
 */
export class UpdateUserComponent extends BaseUserComponent implements OnInit {

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

  //#region LifeCycle Events

  /**
   * Método que é executado ao iniciar o componente
   */
  public async ngOnInit(): Promise<void | boolean> {
    if (!this.isUpdate)
      return await this.router.navigateByUrl('/dashboard/users');

    this.loading.open();

    const entityId = this.route.snapshot.paramMap.get('entityId');
    const { error, success: entity } = await this.http.get<UserProxy>(`/users/${ entityId }`);

    this.loading.close();

    if (error)
      return await this.router.navigateByUrl('/dashboard/users');

    this.formGroup.controls.email.setValue(entity.email);

    const hasRole = searchRole => entity.permissions.split('|').some(role => role === searchRole);

    const hasUser = hasRole('user');
    const hasUserAdmin = hasRole('admin');

    this.formGroup.controls.roles.setValue(hasUserAdmin ? 'admin' : hasUser ? 'user' : 'none');
    this.formGroup.controls.isActive.setValue(entity.isActive);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método chamado ao atualizar um produto
   */
  public async onSubmit(): Promise<void> {
    this.loading.open();

    const payload = this.formGroup.getRawValue();
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const { error } = await this.http.put<UserProxy>(`/users/${ entityId }`, payload);

    if (error) {
      this.loading.close();

      return JqueryHelper.error(getCrudErrors(error)[0]);
    }

    this.loading.close();

    JqueryHelper.success('Usuário atualizado com sucesso!');

    await this.router.navigateByUrl(`/dashboard/users`);
  }

  //#endregion

}
