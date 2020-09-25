import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouteInfo } from '../../models/interfaces/route-info';
import { Keys } from '../../utils/keys';

//#region JQuery

/**
 * JQuery instance
 */
declare const $: any;

//#endregion

//#region Components

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

//#endregion

/**
 * A classe que representa a barra de menu
 */
export class SidebarComponent implements OnInit {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly router: Router,
  ) { }

  //#endregion

  //#region Public Properties

  /**
   * Os itens do menu
   */
  public menuItems: RouteInfo[] = [];

  //#endregion

  //#region LifeCycle Events

  /**
   * Método executado ao iniciar o componente
   */
  public async ngOnInit(): Promise<void> {
    const user = localStorage.getItem(Keys.USER_INFO);

    if (!user) {
      localStorage.clear();

      await this.router.navigateByUrl('/login');

      return;
    }

    const userRoles = JSON.parse(user).permissions.split('|');
    this.menuItems = JSON.parse(JSON.stringify(Keys.ROUTES)).filter(route => userRoles.some(role => route.roles.includes(role)));
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que navega o usuário para uma página em específico
   *
   * @param path O caminho da página
   */
  public async onClickToNavigate(path: string): Promise<void> {
    if (path !== '/login')
      return;

    localStorage.clear();
  }

  //#endregion

}
