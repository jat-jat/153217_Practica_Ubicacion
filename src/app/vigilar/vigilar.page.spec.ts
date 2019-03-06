import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VigilarPage } from './vigilar.page';

describe('VigilarPage', () => {
  let component: VigilarPage;
  let fixture: ComponentFixture<VigilarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VigilarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VigilarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
