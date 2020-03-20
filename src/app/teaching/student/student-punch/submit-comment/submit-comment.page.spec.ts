import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmitCommentPage } from './submit-comment.page';

describe('SubmitCommentPage', () => {
  let component: SubmitCommentPage;
  let fixture: ComponentFixture<SubmitCommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitCommentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitCommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
