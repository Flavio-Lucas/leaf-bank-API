//#region Imports

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';

import { DialogLoadingComponent } from './dialog.loading.component';
import { DialogLoadingModule } from './dialog.loading.module';

//#endregion

/**
 * A classe que representa o serviço que lida com o Dialog do Loading
 */
@Injectable({
  providedIn: DialogLoadingModule,
})
export class DialogLoadingService {

  //#region Constructor

  constructor(
    private dialog: MatDialog,
  ) {}

  //#endregion

  //#region Private Properties

  /**
   * A referencia do dialog
   */
  private dialogRef: MatDialogRef<DialogLoadingComponent> | undefined;

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
  public open(): void {
    if (this.dialogRef)
      return;

    this.dialogRef = this.dialog.open(DialogLoadingComponent, { disableClose: true, panelClass: 'dialog-loading' });

    this.subscription = this.dialogRef.afterClosed().subscribe(() => {
      this.subscription.unsubscribe();

      this.dialogRef = undefined;
      this.subscription = undefined;
    });
  }

  /**
   * Método que fecha o dialog de loading
   */
  public close(): void {
    if (!this.dialogRef)
      return;

    this.dialogRef.close();
  }

  //#endregion


}
