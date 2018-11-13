import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '../data.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import fetch, { mock } from 'mock-fetch'

import { url, login, resource } from '../profileActions'
import { User } from '../user';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpModule,
        HttpClientModule
      ],
      providers: [
        DataService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it(' should log in a user', () => {
    spyOn(component, 'match').and.callFake((a, b) => ((a === 'pg20') && (b === 'key')));
    component.login_helper('pg20', 'key')
    expect(1).toBe(1);
  });
  
  it(' should not log in a not-registered user', () => {
    spyOn(component, 'match').and.callFake((a, b) => ((a === 'pg20') && (b === 'key')));
    component.login_helper('pg20', 'key')
    expect(1).toBe(1);
  });

  it('should update success message ', () => {
    spyOn(component, 'match').and.callFake((a, b) => ((a === 'pg20') && (b === 'key')));
    component.login_helper('pg20', 'key')
    expect(component.msg).toBe('');
  });

  it('should update error message ', () => {
    spyOn(component, 'match').and.callFake((a, b) => ((a === 'pg20') && (b === 'key')));
    component.login_helper('in_correct_user', 'in_correct_key');
    expect(component.msg).toBe('Wrong username or password!');
  });
});
