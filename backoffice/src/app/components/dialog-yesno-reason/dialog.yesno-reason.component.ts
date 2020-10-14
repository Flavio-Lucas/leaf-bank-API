//#region Imports

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

//#endregion

/**
 * O conteudo para esse componente de dialog
 */
export interface DialogYesnoReasonContent {

  /**
   * O titulo para o componente
   */
  title: string;

  /**
   * A mensagem para essa modal
   */
  message: string;

  /**
   * O texto do placeholder
   */
  placeholderText: string;

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
  onClickOkayButton?: (data: any) => void | Promise<void>;

  /**
   * A ação para quando ele clicar em cancelar
   */
  onClickCancelButton?: Function;

}

@Component({
  selector: 'app-dialog-yesno-reason',
  template: `
  <div class="col">
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="mat-typography">
      <p class="text-wrap text-justify">{{ data.message }}</p>
    </mat-dialog-content>
    
    <mat-form-field [formGroup]="formGroup" class="my-3">
      <input matInput [placeholder]="data.placeholderText" formControlName="reason" >
    </mat-form-field>
  
    <mat-dialog-actions align="end">
      <button mat-button  [disabled]="formGroup.status === 'INVALID'" (click)="onClickOkay()">{{ data.okayText || 'Sim' }}</button>
      <button mat-button (click)="onClickCancel()" [mat-dialog-close]="true" cdkFocusInitial>{{ data.cancelText || 'Não' }}</button>
    </mat-dialog-actions>
  </div>
  `,
})
/**
 * A classe que representa o componente que lida com respostas de sim e não
 */
export class DialogYesnoReasonComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogYesnoReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogYesnoReasonContent,
  ) {
    this.formGroup = this.formBuilder.group({
      reason: ['', Validators.required],
    });
  }

  //#endregion

  //#region Public Properties

  /**
   * O formulário para salvar as informações do form
   */
  public formGroup: FormGroup;

  //#endregion

  //#region Public Methods

  /**
   * A ação para quando ele clicar em okay
   */
  public onClickOkay(): void {
    this.dialogRef.close();

    if (typeof this.data.onClickOkayButton === 'function')
      this.data.onClickOkayButton(this.formGroup.getRawValue());
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
