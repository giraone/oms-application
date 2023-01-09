import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DocumentAccessEntryDetailComponent } from './document-access-entry-detail.component';

describe('DocumentAccessEntry Management Detail Component', () => {
  let comp: DocumentAccessEntryDetailComponent;
  let fixture: ComponentFixture<DocumentAccessEntryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentAccessEntryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ documentAccessEntry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DocumentAccessEntryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DocumentAccessEntryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load documentAccessEntry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.documentAccessEntry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
