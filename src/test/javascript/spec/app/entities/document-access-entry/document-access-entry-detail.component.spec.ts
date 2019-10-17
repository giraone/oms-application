import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OmsTestModule } from '../../../test.module';
import { DocumentAccessEntryDetailComponent } from 'app/entities/document-access-entry/document-access-entry-detail.component';
import { DocumentAccessEntry } from 'app/shared/model/document-access-entry.model';

describe('Component Tests', () => {
  describe('DocumentAccessEntry Management Detail Component', () => {
    let comp: DocumentAccessEntryDetailComponent;
    let fixture: ComponentFixture<DocumentAccessEntryDetailComponent>;
    const route = ({ data: of({ documentAccessEntry: new DocumentAccessEntry(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OmsTestModule],
        declarations: [DocumentAccessEntryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DocumentAccessEntryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocumentAccessEntryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.documentAccessEntry).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
