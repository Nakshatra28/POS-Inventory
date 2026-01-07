import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchespopupComponent } from './purchespopup.component';

describe('PurchespopupComponent', () => {
  let component: PurchespopupComponent;
  let fixture: ComponentFixture<PurchespopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchespopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchespopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
