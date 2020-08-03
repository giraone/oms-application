import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OmsTestModule } from '../../../test.module';
import { DocumentObjectDetailComponent } from 'app/entities/document-object/document-object-detail.component';
import { DocumentObject } from 'app/shared/model/document-object.model';

describe('Component Tests', () => {
  describe('DocumentObject Management Detail Component', () => {
    let comp: DocumentObjectDetailComponent;
    let fixture: ComponentFixture<DocumentObjectDetailComponent>;
    const route = ({ data: of({ documentObject: new DocumentObject(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OmsTestModule],
        declarations: [DocumentObjectDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
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
        expect(comp.documentObject).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
