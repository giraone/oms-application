import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'document-object',
        data: { pageTitle: 'omsApp.documentObject.home.title' },
        loadChildren: () => import('./document-object/document-object.module').then(m => m.DocumentObjectModule),
      },
      {
        path: 'document-access-entry',
        data: { pageTitle: 'omsApp.documentAccessEntry.home.title' },
        loadChildren: () => import('./document-access-entry/document-access-entry.module').then(m => m.DocumentAccessEntryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
