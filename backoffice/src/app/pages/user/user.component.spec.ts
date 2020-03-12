import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSectorComponent } from './base-post.component';

describe('PostComponent', () => {
  let component: BaseSectorComponent;
  let fixture: ComponentFixture<BaseSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
