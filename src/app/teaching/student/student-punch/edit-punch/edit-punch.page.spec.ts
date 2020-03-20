import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPunchPage } from './edit-punch.page';

describe('EditPunchPage', () => {
  let component: EditPunchPage;
  let fixture: ComponentFixture<EditPunchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPunchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPunchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
