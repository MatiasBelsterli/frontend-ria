import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakerViewComponent } from './BakerViewComponent';

describe('BakerViewComponent', () => {
  let component: BakerViewComponent;
  let fixture: ComponentFixture<BakerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BakerViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BakerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
