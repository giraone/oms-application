import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { OmsSharedModule } from 'app/shared/shared.module';
import { OmsCoreModule } from 'app/core/core.module';
import { OmsAppRoutingModule } from './app-routing.module';
import { OmsHomeModule } from './home/home.module';
import { OmsEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

import { OmsDocumentsViewModule } from './documents/documents-view/documents-view.module';

@NgModule({
  imports: [
    BrowserModule,
    OmsSharedModule,
    OmsCoreModule,
    OmsHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    OmsEntityModule,
    OmsAppRoutingModule,
    OmsDocumentsViewModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class OmsAppModule {}
