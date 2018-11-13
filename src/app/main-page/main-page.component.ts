import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { images } from '../images';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})

export class MainPageComponent implements OnInit {
  user: User;
  headshot: string;
  followers: Object[];
  sfollowers: Object[];
  posts: Object[];
  sposts: Object[];
  addName: string;
  userStatus: string;
  newStatus: string;
  inputTxt: string;
  searchKey: string;
  textonly: boolean;
  comments: boolean[];

  clearTxt(): void {
    this.inputTxt = '';
  }

  //get followers from JSON
  getFollowers(): void {
    this.http.get('/assets/followers.json')
      .map(res => res.json())
      .subscribe(f => this.followers = f.followers);
  }

  //get posts form JSON
  getPost(): void {
    this.http.get('/assets/posts.json')
      .map(res => res.json())
      .subscribe(f => {
        this.posts = f.posts
        this.sposts = this.sposts.concat(f.posts.filter( p => { return p["author"] == this.user.userName }));
        this.comments = new Array<boolean>(this.sposts.length)
      })
  }

  remove(id: number): void {
    this.rmPost(this.sfollowers[id]["name"])
    this.sfollowers.splice(id, 1);
  }

  addFlo(): void {
    if (this.addName) {
      let newfollower = this.followers.find(f => { return f["name"] == this.addName })
      if (newfollower && newfollower["name"] != this.user.userName) {
        if (!this.sfollowers.find(f => { return f["name"] == newfollower["name"] })) {
          this.sfollowers.push(newfollower)
          this.addPost(this.addName)
        }
        this.addName = ''
      }
      else this.addName = "This user doesn't exist!"
    }
  }

  addPost(name: string): void {
    let ssposts = this.posts.filter(p => { return p["author"] == name })
    this.sposts = ssposts.concat(this.sposts)
    this.comments = new Array<boolean>(this.sposts.length)
  }

  rmPost(name: string): void {
    this.sposts = this.sposts.filter(p => { return p["author"] != name })
    this.comments = new Array<boolean>(this.sposts.length)
  }

  updateStatus(): void {
    if (this.newStatus) {
      this.userStatus = this.newStatus;
      localStorage.userStatus = this.userStatus;
    }
    this.newStatus = '';
  }

  newPost(): void {
    if (this.inputTxt) {
      let newP = {
        content: this.inputTxt,
        author: this.user.displayName,
        img: images[Math.floor(Math.random() * 4)]
      }
      if (this.textonly)
        newP.img = ''
      if (!localStorage.newP) {
        localStorage.newP = JSON.stringify({ newp: [newP] })
      }
      else {
        let newPs = JSON.parse(localStorage.newP).newp
        newPs = [newP].concat(newPs)
        localStorage.newP = JSON.stringify({ newp: newPs })
      }
      this.sposts.unshift(newP)   //unshift即把元素加在array左边
      this.comments.unshift(false)
    }
  }

  hideAndShow(index: number): void {
    this.comments[index] = !this.comments[index]
  }

  constructor(
    private dataService: DataService,
    private http: Http
  ) { }

  ngOnInit() {
    this.user = this.dataService.getUser();
    this.sposts = (localStorage.newP) ? JSON.parse(localStorage.newP).newp : [];
    this.sfollowers = [];
    this.getFollowers();
    this.getPost();
    this.headshot = images[0];
    if (localStorage.userStatus)
      this.userStatus = localStorage.userStatus;
    else
      this.userStatus = 'Happy midterm!';
  }

}
