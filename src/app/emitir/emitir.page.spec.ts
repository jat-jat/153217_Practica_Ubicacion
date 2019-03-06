import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirPage } from './emitir.page';

describe('EmitirPage', () => {
  let component: EmitirPage;
  let fixture: ComponentFixture<EmitirPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitirPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
