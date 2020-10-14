import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import localeFr from '@angular/common/locales/pt-PT';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { httpAsyncFactory } from './factories/http-async/http-async.factory';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HttpAsyncService } from './services/http-async/http-async.service';
import { Interceptor } from './utils/interceptor';

registerLocaleData(localeFr, 'pt-PT');

@NgModule({
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
  ],
  providers: [
    { provide: HttpAsyncService, useFactory: httpAsyncFactory, deps: [HttpClient] },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-PT' },
  ],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule {
}
