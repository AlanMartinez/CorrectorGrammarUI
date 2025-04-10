import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePlayComponent } from './role-play.component';

describe('RolePlayComponent', () => {
  let component: RolePlayComponent;
  let fixture: ComponentFixture<RolePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
