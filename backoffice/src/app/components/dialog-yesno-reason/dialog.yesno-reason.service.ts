//#region Imports

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';

import { DialogYesnoReasonContent, DialogYesnoReasonComponent } from './dialog.yesno-reason.component';
import { DialogYesnoReasonModule } from './dialog.yesno-reason.module';

//#endregion

/**
 * A classe que representa o serviço que lida com o Dialog do YesNo
 */
@Injectable({
  providedIn: DialogYesnoReasonModule,
})
export class DialogYesnoReasonService {

  //#region Constructor

  constructor(
    private dialog: MatDialog,
  ) {}

  //#endregion

  //#region Private Properties

  /**
   * A referencia do dialog
   */
  private dialogRef: MatDialogRef<DialogYesnoReasonComponent> | undefined;

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
  public openDialog(data: DialogYesnoReasonContent): void {
    if (this.dialogRef)
      return;

    this.dialogRef = this.dialog.open(DialogYesnoReasonComponent, { disableClose: true, data, });

    this.subscription = this.dialogRef.afterClosed().subscribe(() => {
      this.subscription.unsubscribe();

      this.dialogRef = undefined;
      this.subscription = undefined;
    });
  }

  //#endregion


}
