import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentObject } from '../document-object.model';

@Component({
  selector: 'jhi-document-object-detail',
  templateUrl: './document-object-detail.component.html',
})
export class DocumentObjectDetailComponent implements OnInit {
  documentObject: IDocumentObject | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      this.documentObject = documentObject;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
