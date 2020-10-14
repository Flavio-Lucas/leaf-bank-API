//#region Imports

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { DialogYesnoContent, DialogYesnoComponent } from './dialog.yesno.component';
import { DialogYesnoModule } from './dialog.yesno.module';

//#endregion

/**
 * A classe que representa o serviço que lida com o Dialog do YesNo
 */
@Injectable({
  providedIn: DialogYesnoModule,
})
export class DialogYesnoService {

  //#region Constructor

  constructor(
    private dialog: MatDialog,
  ) {}

  //#endregion

  //#region Private Properties

  /**
   * A referencia do dialog
   */
  private dialogRef: MatDialogRef<DialogYesnoComponent> | undefined;

  /**
   * A inscrição para apos fechar
   */
  private subscription: Subscription;

  //#endregion

  //#region Public Methods

  /**
   * Método que abre o dialog
   *
   * @param data As informações para abrir o componente
   */
  public openDialog(data: DialogYesnoContent): void {
    if (this.dialogRef)
      return;

    this.dialogRef = this.dialog.open(DialogYesnoComponent, { disableClose: true, data, });

    this.subscription = this.dialogRef.afterClosed().subscribe(() => {
      this.subscription.unsubscribe();

      this.dialogRef = undefined;
      this.subscription = undefined;
    });
  }

  //#endregion


}
