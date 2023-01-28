import { Injectable } from '@angular/core';
import { siteData } from 'src/app/_data/site-data';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor() {}

  getSetList(): any[] {
    return siteData.map((set) => {
      return {
        setName: set.setName,
        displayName: set.displayName,
        type: set.type,
        iconCount: set.icons.length,
      };
    });
  }

  getSetDisplayName(setName: string): string {
    return siteData.find((set) => set.setName === setName)?.displayName || '';
  }

  getSet(setName: string): any {
    return siteData.find((set) => set.setName === setName);
  }

  getIconList(setName: string): any[] {
    return siteData.find((set) => set.setName === setName)?.icons || [];
  }

  searchIcons(searchTerm: string): any[] {
    const results: any[] = [];
    if (searchTerm.length < 2) {
      return results;
    }
    siteData.forEach((set) => {
      set.icons.forEach((icon) => {
        if (icon.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(icon);
        }
        icon.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(icon);
          }
        });
      });
    });
    return results;
  }
}
