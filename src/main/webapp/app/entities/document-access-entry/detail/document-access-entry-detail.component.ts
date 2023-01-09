import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentAccessEntry } from '../document-access-entry.model';

@Component({
  selector: 'jhi-document-access-entry-detail',
  templateUrl: './document-access-entry-detail.component.html',
})
export class DocumentAccessEntryDetailComponent implements OnInit {
  documentAccessEntry: IDocumentAccessEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentAccessEntry }) => {
      this.documentAccessEntry = documentAccessEntry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
