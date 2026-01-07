import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliereditComponent } from './supplieredit.component';

describe('SuppliereditComponent', () => {
  let component: SuppliereditComponent;
  let fixture: ComponentFixture<SuppliereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliereditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuppliereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
