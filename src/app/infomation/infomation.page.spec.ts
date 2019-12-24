import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfomationPage } from './infomation.page';

describe('InfomationPage', () => {
  let component: InfomationPage;
  let fixture: ComponentFixture<InfomationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfomationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfomationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
