import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentPunchPage } from './student-punch.page';

describe('StudentPunchPage', () => {
  let component: StudentPunchPage;
  let fixture: ComponentFixture<StudentPunchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPunchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentPunchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
