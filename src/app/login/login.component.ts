import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  registeredUsers: User[];
  msg: string;

  loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  })

  login(): void {
    let logUserName = this.loginForm.get('userName').value;
    let logPassword = this.loginForm.get('password').value;
    this.login_helper(logUserName, logPassword);
  }

  login_helper(logUserName, logPassword): void {
    let matchUser = this.match(logUserName, logPassword);
    if (matchUser) {
      localStorage.user = JSON.stringify(matchUser);
      this.router.navigate(['/mainpage']);
    }
    else {
      this.msg = 'Wrong username or password!'
    }
  }

  match(logUserName, logPassword): User {
    return this.registeredUsers.find(user => user.userName === logUserName && user.password === logPassword);
  }

  constructor(
    private router: Router,
    private http: Http
  ) { }

  ngOnInit() {
    localStorage.clear();
    this.msg = '';
    this.http.get('assets/users.json')
      .map(res => res.json()) //这个map是rxjs里的map，跟array的map不一样，rxjs是reactive javascript, 在最上面import了，用来实现异步之类的操作。map的this参数（即.map左边，调用map的主体)是any 类型，返回一个observable类型。所以这里输入一个observable，返回一个observable，途中把
      .subscribe(u => this.registeredUsers = u.users)
  }
}