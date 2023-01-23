import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideostrComponent } from './videostr.component';

describe('VideostrComponent', () => {
  let component: VideostrComponent;
  let fixture: ComponentFixture<VideostrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideostrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideostrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
