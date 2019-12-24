import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwitchIdentityPage } from './switch-identity.page';

describe('SwitchIdentityPage', () => {
  let component: SwitchIdentityPage;
  let fixture: ComponentFixture<SwitchIdentityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchIdentityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchIdentityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
