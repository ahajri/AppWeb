import{Component,Input,View} from'angular2/core';
import{CountryService} from'../../service/CountryService';
import{CORE_DIRECTIVES} from'angular2/common';
import{Http,Headers} from'angular2/http';
import{AuthHttp} from'angular2-jwt';
import{Router} from'angular2/router';
import{SearchCountry} from'./country-pipe';

let template=require('./country-detail.html');
let styles=require('./country-detail.css');
let countries=require('../../../backend/countries.json');

@Component
({
	selector:'country-detail',
	template:template
	})
export class CountryDetail {

	@Input() eduProps;
	jwt:string;
	response:string;
	countryList:Array<any>
	
	constructor(public countryService:CountryService,public http: Http){
		this.countryList=countries;
		this.jwt = localStorage.getItem('jwt')
	}
	
	showEducProperties(countryCode){
		this.http.get('http://localhost:8020/api/educprop/')
        .subscribe(
          response => this.addEduProps(response._body),
          error => this.response = error
        );
		
	}
	
	addEduProps(response){
			  this.eduProps=[];
			  for (  var i = 0; i <JSON.parse(response)[0].content.length; i++) {
				  console.log(JSON.stringify(JSON.parse(response)[0].content[i]));
				  this.eduProps.push(JSON.parse(response)[0].content[i]);
			  }
		
	}
}
