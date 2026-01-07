import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierpopupComponent } from './supplierpopup.component';

describe('SupplierpopupComponent', () => {
  let component: SupplierpopupComponent;
  let fixture: ComponentFixture<SupplierpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
