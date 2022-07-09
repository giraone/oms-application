import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'documents',
        data: { pageTitle: 'omsApp.documentObject.home.title' },
        loadChildren: () => import('./documents-view/documents-view.module').then(m => m.DocumentsViewModule),
      },
    ]),
  ],
})
export class DocumentsRoutingModule {}
