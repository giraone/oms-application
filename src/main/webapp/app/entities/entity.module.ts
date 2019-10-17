import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'document-object',
        loadChildren: () => import('./document-object/document-object.module').then(m => m.OmsDocumentObjectModule)
      },
      {
        path: 'document-access-entry',
        loadChildren: () => import('./document-access-entry/document-access-entry.module').then(m => m.OmsDocumentAccessEntryModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class OmsEntityModule {}
