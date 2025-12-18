import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: false,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term: string): any[] {
    return items.filter((item) => {
      return (
        item.name
          .toLowerCase()
          .replace(/ /g, '')
          .includes(term.toLowerCase().replace(/ /g, '')) ||
        item.tags.join(', ').toLowerCase().includes(term.toLowerCase())
      );
    });
  }
}
