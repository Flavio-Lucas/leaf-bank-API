//#region Imports

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

//#endregion

/**
 * O conteudo para esse componente de dialog
 */
export interface DialogYesnoContent {

  /**
   * O titulo para o componente
   */
  title: string;

  /**
   * A mensagem para essa modal
   */
  message: string;

  /**
   * O texto do botão de concordar
   */
  okayText?: string;

  /**
   * O texto do botão de cancelar
   */
  cancelText?: string;

  /**
   * A ação para quando ele clicar em okay
   */
  onClickOkayButton?: Function;

  /**
   * A ação para quando ele clicar em cancelar
   */
  onClickCancelButton?: Function;

}

@Component({
  selector: 'app-dialog-yesno',
  template: `
  <div class="col">
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="mat-typography">
      <p class="text-wrap text-justify">{{ data.message }}</p>
    </mat-dialog-content>
  
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClickOkay()">{{ data.okayText || 'Sim' }}</button>
      <button mat-button (click)="onClickCancel()" [mat-dialog-close]="true" cdkFocusInitial>{{ data.cancelText || 'Não' }}</button>
    </mat-dialog-actions>
  </div>
  `,
})
/**
 * A classe que representa o componente que lida com respostas de sim e não
 */
export class DialogYesnoComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    public dialogRef: MatDialogRef<DialogYesnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogYesnoContent,
  ) {}

  //#endregion

  //#region Public Methods

  /**
   * A ação para quando ele clicar em okay
   */
  public onClickOkay(): void {
    this.dialogRef.close();

    if (typeof this.data.onClickOkayButton === 'function')
      this.data.onClickOkayButton();
  }

  /**
   * A ação para quando ele clicar em cancelar
   */
  public onClickCancel(): void {
    this.dialogRef.close();

    if (typeof this.data.onClickCancelButton === 'function')
      this.data.onClickCancelButton();
  }

  //#endregion

}
