import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenningScreenComponent } from './openning-screen.component';

describe('OpenningScreenComponent', () => {
  let component: OpenningScreenComponent;
  let fixture: ComponentFixture<OpenningScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenningScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenningScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
