import {Component,Input} from 'angular2/core';
import {CountryService} from '../../service/CountryService';

let template = require('./country-detail.html');
let styles=require('./country-detail.css');
//let countries = require('../../../backend/countries.json');

@Component({
	selector:'country-detail',
	template: template,
})

export class CountryDetail {
	@Input() countries;
	constructor(public countryService:CountryService){
		
	}
}
