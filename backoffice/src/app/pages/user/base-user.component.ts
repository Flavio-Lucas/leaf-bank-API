//#region Imports

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DialogLoadingService } from '../../components/dialog-loading/dialog.loading.service';
import { HttpAsyncService } from '../../services/http-async/http-async.service';

//#endregion

/**
 * A classe base para a criação de uma entidade
 */
export class BaseUserComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    protected loading: DialogLoadingService,
    protected formBuilder: FormBuilder,
    protected route: ActivatedRoute,
    protected http: HttpAsyncService,
  ) {
    this.isUpdate = route.snapshot.paramMap.has('entityId');

    this.formGroup = formBuilder.group({
      email: ['', Validators.required],
      password: this.isUpdate ? [''] : ['', Validators.required],
      roles: ['', Validators.required],
      isActive: [true],
    });
  }

  //#endregion

  //#region Default Public Properties

  /**
   * Diz se está atualizando
   */
  public isUpdate: boolean;

  /**
   * As informações do form
   */
  public formGroup: FormGroup;

  //endregion

}
