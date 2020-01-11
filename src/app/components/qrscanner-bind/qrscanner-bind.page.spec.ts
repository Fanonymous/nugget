import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QrscannerBindPage } from './qrscanner-bind.page';

describe('QrscannerBindPage', () => {
  let component: QrscannerBindPage;
  let fixture: ComponentFixture<QrscannerBindPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrscannerBindPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QrscannerBindPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
