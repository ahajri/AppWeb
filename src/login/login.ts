import { Component, View } from 'angular2/core';
import { Router, RouterLink } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES ,FormBuilder, Validators} from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { contentHeaders } from '../common/headers';
import {ValidationService} from '../service/ValidationService';

let styles   = require('./login.css');
let template = require('./login.html');

@Component({
  selector: 'login'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES ],
  template: template,
  styles: [ styles ]
})
export class Login {
	
  loginForm:any;
  loading:boolean;
  errorMsg:string;	
  constructor(public router: Router, public http: Http, public _formBuilder: FormBuilder) {
	  this.loginForm = this._formBuilder.group({
	        'username': ['', Validators.required],
	        'password': ['', Validators.required]
	    });
	  this.loading =false;
	  this.errorMsg=null;  
  }

  login(event, username, password) {
    event.preventDefault();
    let body = JSON.stringify({ username, password });
    this.loading = true;
    this.http.post('http://localhost:8020/sessions/create', body, { headers: contentHeaders })
      .subscribe(
        response => {
          this.loading=false;
          localStorage.setItem('jwt', response.json().id_token);
          this.router.parent.navigateByUrl('/home');
        },
        error => {
          this.loading=false;
          this.errorMsg=JSON.stringify(error._body);
        }
      );
  }

  signup(event) {
    event.preventDefault();
    this.router.parent.navigateByUrl('/signup');
  }
}
