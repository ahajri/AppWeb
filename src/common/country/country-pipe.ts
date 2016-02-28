import{Pipe,PipeTransform}from'angular2/core';

@Pipe({
	name:"searchCountry"
})
export class SearchCountry {

	transform(value){
		return value;
		//.filter((item) => item.name.common.toLowarCase().startsWith(value.toLowarCase());
	}
}