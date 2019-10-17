import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentAccessEntry } from 'app/shared/model/document-access-entry.model';

@Component({
  selector: 'jhi-document-access-entry-detail',
  templateUrl: './document-access-entry-detail.component.html'
})
export class DocumentAccessEntryDetailComponent implements OnInit {
  documentAccessEntry: IDocumentAccessEntry;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentAccessEntry }) => {
      this.documentAccessEntry = documentAccessEntry;
    });
  }

  previousState() {
    window.history.back();
  }
}
