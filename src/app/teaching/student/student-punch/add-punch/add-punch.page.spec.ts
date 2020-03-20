import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPunchPage } from './add-punch.page';

describe('AddPunchPage', () => {
  let component: AddPunchPage;
  let fixture: ComponentFixture<AddPunchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPunchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPunchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
