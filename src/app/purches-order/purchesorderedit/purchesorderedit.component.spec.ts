import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchesordereditComponent } from './purchesorderedit.component';

describe('PurchesordereditComponent', () => {
  let component: PurchesordereditComponent;
  let fixture: ComponentFixture<PurchesordereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchesordereditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchesordereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
