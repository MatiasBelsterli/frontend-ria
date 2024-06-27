import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliesListModalComponent } from './supplies-list-modal.component';

describe('SuppliesListModalComponent', () => {
  let component: SuppliesListModalComponent;
  let fixture: ComponentFixture<SuppliesListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuppliesListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuppliesListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
