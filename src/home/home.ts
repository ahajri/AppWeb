import{Component,View,Input}from'angular2/core';
import{CORE_DIRECTIVES}from'angular2/common';
import{Http,Headers}from'angular2/http';
import{AuthHttp}from'angular2-jwt';
import{Router}from'angular2/router';
import{CHART_DIRECTIVES}from'ng2-charts/ng2-charts';
import{CountrySelector}from'./country-selector';
import{CountryDetail}from'../common/country/country-detail';
import{CountryService}from'../service/CountryService';

let styles=require('./home.css');
let template=require('./home.html');
let countries=require('../../backend/countries.json');

@Component
({
	selector:'home'
		})
@View({
	directives:[CORE_DIRECTIVES,CountrySelector,CountryDetail],
	template:template,
	styles:[styles]
			})
export class Home {
jwt:string;
decodedJwt:string;
response:string;
api:string;
countryList:Array<any>;
eduProps:Array<any>;
loading:boolean;
selected:string;
chart:string;

constructor(public countryService:CountryService,public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('jwt');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.countryList = countries;
    this.loading=false;
    this.eduProps=[];

  }

  searchCountry(name){
	  this.http.get('http://localhost:8020/api/search-countries/'+name)
      .subscribe(
        response =>  this.mapRes(response._body) ,
        error => this.response = JSON.parse(error._body)
      )
  }

  mapRes(response){
	  console.log(JSON.parse(response));
	  this.countryList=[];
	  for (  var i = 0; i < JSON.parse(response).length; i++) {
		  this.countryList.push(response[i]);
		  console.log(JSON.parse(response)[i]);
	  }
	  
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

	listPersons(country){
		this.http.get('http://localhost:8020/persons/'+country)
        .subscribe(
          response => this.chart = response.text(),
          error => this.chart = error.text()
        )
	}
	
	graph(){
		this._callApi('Anonymous', 'http://localhost:8020/api/manage-profile');
	}
	
	updateEduProps(event){
		this.eduProps=[];
		this.eduProps.push.apply(this.eduProps,event);

	}
	getSelected(event){
		console.log(event)
	}
	csv2jsonAndSaveInML(){
		this.loading=true;
		this.http.get('http://localhost:8020/api/csv2json')
        .subscribe(
          response => this.loading=false,//this.endConversion(),
          error => this.response = error.text()
        );
	}
	
	startLoading(){
		this.loading=false;
		this.response ="XLS converted and inserted in datbase"
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
