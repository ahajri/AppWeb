import {Injectable} from "angular2/core";
import{Http,Headers}from'angular2/http';

let countries = require('../../backend/countries.json');

@Injectable()
export class CountryService{
	response:string;	
	
	constructor(public http:Http){
		
	}
	 searchCountry(cca3){
		  this._callApi('Anonymous', 'http://localhost:8020/api/search-countries/'+cca3);
	  }
	 _callApi(type, url) {
		    this.response = null;
		    if (type === 'Anonymous') {
		      this.http.get(url)
		        .subscribe(
		          response => this.response = response.text(),
		          error => this.response = error.text()
		        );
		    }
		   
	   }
}