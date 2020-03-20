import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PunchDetailPage } from './punch-detail.page';

describe('PunchDetailPage', () => {
  let component: PunchDetailPage;
  let fixture: ComponentFixture<PunchDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PunchDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PunchDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
