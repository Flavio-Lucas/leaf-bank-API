//#region Imports

import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouteInfo } from '../../models/interfaces/route-info';
import { Keys } from '../../utils/keys';

//#endregion

//#region Components

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

//#endregion

/**
 * A classe que representa o componente da NavBar
 */
export class NavbarComponent implements OnInit {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private location: Location,
    private element: ElementRef,
    private router: Router,
  ) {
    this.sidebarVisible = false;
  }

  //#endregion

  //#region Private Properties

  /**
   * Diz se o menu do mobile está visível
   */
  private mobile_menu_visible = false;

  /**
   * A lista de rotas da aplicação
   */
  private listRoutes: RouteInfo[];

  /**
   * O botão para realizar o toggle da sidebar
   */
  private toggleButton: Element;

  /**
   * Diz se a sidebar está visível
   */
  private sidebarVisible: boolean;

  //#endregion

  //#region LifeCycle Events

  /**
   * Método executado ao iniciar o componente
   */
  public ngOnInit(): void {
    this.listRoutes = Keys.ROUTES.filter(listTitle => listTitle);

    const navbar: HTMLElement = this.element.nativeElement;

    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];

    this.router.events.subscribe(() => {
      this.sidebarClose();

      const layer: Element = document.getElementsByClassName('close-layer')[0];

      if (!layer)
        return;

      layer.remove();
      this.mobile_menu_visible = false;
    });
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que abre a sidebar
   */
  public sidebarOpen(): void {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];

    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
  }

  /**
   * Método que fecha a sidebar
   */
  public sidebarClose(): void {
    const body = document.getElementsByTagName('body')[0];

    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;

    body.classList.remove('nav-open');
  }

  /**
   * Método que realiza o toggle da sidebar
   */
  public sidebarToggle(): void {
    const toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false)
      this.sidebarOpen();
    else
      this.sidebarClose();

    const body = document.getElementsByTagName('body')[0];

    if (this.mobile_menu_visible) {
      body.classList.remove('nav-open');

      // layer && layer.remove();

      setTimeout(() => {
        toggle.classList.remove('toggled');
      }, 400);

      this.mobile_menu_visible = false;
      return;
    }

    setTimeout(() => {
      toggle.classList.add('toggled');
    }, 430);

    const layer = document.createElement('div');

    layer.setAttribute('class', 'close-layer');

    if (body.querySelectorAll('.main-panel'))
      document.getElementsByClassName('main-panel')[0].appendChild(layer);
    else if (body.classList.contains('off-canvas-sidebar'))
      document.getElementsByClassName('wrapper-full-page')[0].appendChild(layer);

    setTimeout(function () {
      layer.classList.add('visible');
    }, 100);

    layer.onclick = () => {
      body.classList.remove('nav-open');

      this.mobile_menu_visible = false;

      layer.classList.remove('visible');

      setTimeout(() => {
        layer.remove();

        toggle.classList.remove('toggled');
      }, 400);
    };

    body.classList.add('nav-open');
    this.mobile_menu_visible = true;
  }

  /**
   * Método que retorna o titulo da página
   */
  public getTitle(): string {
    let title = this.location.prepareExternalUrl(this.location.path());

    if (title.charAt(0) === '#')
      title = title.slice(1);

    for (let item = 0; item < this.listRoutes.length; item++) {
      if (this.listRoutes[item].path !== title)
        continue;

      return this.listRoutes[item].title;
    }

    return 'Dashboard';
  }

  /**
   * Método que realiza o logout do usuário
   */
  public async performLogout(): Promise<void> {
    localStorage.clear();

    this.router.navigateByUrl('/login');
  }

  //#endregion

}
