import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MycenterPage } from './mycenter.page';

describe('MycenterPage', () => {
  let component: MycenterPage;
  let fixture: ComponentFixture<MycenterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycenterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MycenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
