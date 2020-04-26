import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCompleteComponent } from './game-complete.component';

describe('GameCompleteComponent', () => {
  let component: GameCompleteComponent;
  let fixture: ComponentFixture<GameCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
