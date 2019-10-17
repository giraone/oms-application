import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentObject } from 'app/shared/model/document-object.model';

@Component({
  selector: 'jhi-document-object-detail',
  templateUrl: './document-object-detail.component.html'
})
export class DocumentObjectDetailComponent implements OnInit {
  documentObject: IDocumentObject;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      this.documentObject = documentObject;
    });
  }

  previousState() {
    window.history.back();
  }
}
