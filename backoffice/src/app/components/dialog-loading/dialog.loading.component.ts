//#region Imports

import { Component } from '@angular/core';

//#endregion

//#region Components

@Component({
  selector: 'app-loading-modal',
  template: `<mat-progress-spinner [diameter]="32" mode="indeterminate"></mat-progress-spinner>`,
})

//#endregion

/**
 * A classe que exibe uma modal para exibir um loading
 */
export class DialogLoadingComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor() {
  }

  //#endregion
}
