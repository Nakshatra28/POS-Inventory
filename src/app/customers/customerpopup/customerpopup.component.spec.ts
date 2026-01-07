import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerpopupComponent } from './customerpopup.component';

describe('CustomerpopupComponent', () => {
  let component: CustomerpopupComponent;
  let fixture: ComponentFixture<CustomerpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
