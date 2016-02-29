import{Component,View} from'angular2/core';
import{Router,RouterLink} from'angular2/router';
import{CORE_DIRECTIVES,FORM_DIRECTIVES} from'angular2/common';
import{Http} from'angular2/http';
import{contentHeaders} from'../common/headers';

let styles=require('./signup.css');
let template=require('./signup.html');

@Component({selector:'signup'})
@View({
	directives:[RouterLink,CORE_DIRECTIVES,FORM_DIRECTIVES],
	template:template,
	styles:[styles]})
export class Signup {
	isLoading:boolean;
	constructor(public router: Router, public http: Http) {
	  this.isLoading = false;
  }

  signup(event, username, password) {
    event.preventDefault();
    this.isLoading = true;
    let body = JSON.stringify({ username, password });
    this.http.post('http://localhost:8020/users/create', body, { headers: contentHeaders })
      .subscribe(
        response => {
          this.isLoading = false;
          if(response.json().id_token){
        	  localStorage.setItem('jwt', response.json().id_token);
              this.router.parent.navigateByUrl('/login');
          }else{
        	  this.response=response.text();
          }
          
        },
        error => {
          this.isLoading = false;
          this.response=error.text();
          console.log(error.text());
        }
      );
  }

  login(event) {
    event.preventDefault();
    this.router.parent.navigateByUrl('/login');
  }

}
