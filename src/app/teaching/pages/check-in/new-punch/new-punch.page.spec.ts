import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPunchPage } from './new-punch.page';

describe('NewPunchPage', () => {
  let component: NewPunchPage;
  let fixture: ComponentFixture<NewPunchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPunchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPunchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
