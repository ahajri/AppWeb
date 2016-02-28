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
	
	response:string;
	countryList:Array<any>
	
	constructor(public countryService:CountryService,public http: Http){
		this.countryList=countries;
	}
	
	showEducProperties(countryCode){
		this.http.get('http://localhost:8020/api/educprop/')
        .subscribe(
          response => this.addEduProps(response),
          error => this.response = error
        );
		
	}
	
	addEduProps(response){
			  alert(JSON.parse(response));
			  this.eduProps=[];
			  for (  var i = 0; i < JSON.parse(response).length; i++) {
				  this.eduProps.push(response[i]);
			  }
		
	}
}
