import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentPopupComponent } from './stock-adjustment-popup.component';

describe('StockAdjustmentPopupComponent', () => {
  let component: StockAdjustmentPopupComponent;
  let fixture: ComponentFixture<StockAdjustmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockAdjustmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
