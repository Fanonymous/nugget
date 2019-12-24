import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeachingPage } from './teaching.page';

describe('TeachingPage', () => {
  let component: TeachingPage;
  let fixture: ComponentFixture<TeachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
