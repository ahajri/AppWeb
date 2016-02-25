import {Component,Input} from "angular2/core";

@Component({
	selector:'country-selector',
	template: '<b>{{country.name.common}}</b>'
})

export class CountrySelector {
	@Input() country;
}
