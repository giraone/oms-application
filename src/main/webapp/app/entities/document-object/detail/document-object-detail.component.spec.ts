import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DocumentObjectDetailComponent } from './document-object-detail.component';

describe('DocumentObject Management Detail Component', () => {
  let comp: DocumentObjectDetailComponent;
  let fixture: ComponentFixture<DocumentObjectDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentObjectDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ documentObject: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DocumentObjectDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DocumentObjectDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load documentObject on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.documentObject).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
