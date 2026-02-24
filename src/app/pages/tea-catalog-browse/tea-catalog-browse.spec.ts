import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaCatalogBrowse } from './tea-catalog-browse';

describe('TeaCatalogBrowse', () => {
  let component: TeaCatalogBrowse;
  let fixture: ComponentFixture<TeaCatalogBrowse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeaCatalogBrowse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeaCatalogBrowse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
