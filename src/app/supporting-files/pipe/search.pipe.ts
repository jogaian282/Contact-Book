import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})

export class SearchPipe implements PipeTransform {

  transform(value: any, args?: string): Array<any> {

    const searchValue = args.trim();

    if (!value) {
      return [];
    }

    if (!searchValue) {
      return value;
    }

    return value.filter((item: any) => {
      const formattedObj = {
        name: item.name,
        company: item.company
      };
      const searchedObj = JSON.stringify(Object.values(formattedObj));
      if (searchedObj.toLowerCase().includes(searchValue.toLowerCase())) {
        return item;
      }
    });
  }

}
