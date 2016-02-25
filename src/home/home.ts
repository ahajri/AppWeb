import{Component,View,Input}from'angular2/core';
import{CORE_DIRECTIVES}from'angular2/common';
import{Http,Headers}from'angular2/http';
import{AuthHttp}from'angular2-jwt';
import{Router}from'angular2/router';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {CountrySelector} from './country-selector';

let styles=require('./home.css');
let template=require('./home.html');
let countries = require('../../backend/countries.json');

@Component({
	selector:'home'
})
@View({
	directives:[CORE_DIRECTIVES,CountrySelector],
	template:template,
	styles:[styles]
})
export class Home {
	jwt:string;
	decodedJwt:string;
	response:string;
	api:string;
	countryList:Array<any>;


	constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('jwt');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.countryList = countries;
    alert(countries.length);
//    this.bbb = JSON.stringify(countries);
//    alert(countries[0].cca3);
    
//    this.http.get('http://localhost:8020/api/countries')
//    .subscribe(
//      response => {
//        localStorage.setItem('bbb', response.json());
//        this.router.parent.navigateByUrl('/home');
//      },
//      error => {
//        alert(error.text());
//        console.log(error.text());
//      }
//    );
  }

  searchCountry(cca3){
	  this._callApi('Anonymous', 'http://localhost:8020/api/search-countries/'+cca3);
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.parent.navigateByUrl('/login');
  }

	callAnonymousApi() {
    this._callApi('Anonymous', 'http://localhost:8020/api/random-quote');
  }

	callSecuredApi() {
    this._callApi('Secured', 'http://localhost:8020/api/protected/random-quote');
  }
	manageProfile(){
		this._callApi('Anonymous', 'http://localhost:8020/api/manage-profile');
	}

	_callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
  }
	
}
