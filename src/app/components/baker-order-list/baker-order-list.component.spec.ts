import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakerOrderListComponent } from './baker-order-list.component';

describe('BakerOrderListComponent', () => {
  let component: BakerOrderListComponent;
  let fixture: ComponentFixture<BakerOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BakerOrderListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BakerOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
