import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { IconsProviderModule } from './icons-provider.module';
import { AppRoutingModule } from './app-routing.module';
import { NgZorroModule } from './shared/ng-zorro.module';
import { ComponentsModule } from './components/components.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeModule } from './modules/module-home/home.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GlobalModule } from './modules/module-global/global.module';
import { DocsModule } from './modules/module-docs/docs.module';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DocsModule,
    HomeModule,
    AppRoutingModule,
    GlobalModule,
    NgZorroModule,
    PdfViewerModule
  ]
})
export class AppModule { }
