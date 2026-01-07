import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchesOrderComponent } from './purches-order.component';

describe('PurchesOrderComponent', () => {
  let component: PurchesOrderComponent;
  let fixture: ComponentFixture<PurchesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchesOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
