import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { siteData } from 'src/app/_data/site-data';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  // Empty constructor - no initialization needed

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

  getSet(setName: string): Observable<any> {
    return new Observable((observer) => {
      observer.next(siteData.find((set) => set.setName === setName));
      observer.complete();
    });
  }

  getIconList(setName: string): Observable<any> {
    return new Observable((observer) => {
      observer.next(siteData.find((set) => set.setName === setName)?.icons);
      observer.complete();
    });
  }

  getIcon(setName: string, iconName: string): Observable<any> {
    return new Observable((observer) => {
      observer.next(
        siteData
          .find((set) => set.setName === setName)
          ?.icons.find((icon) => icon.name === iconName)
      );
      observer.complete();
    });
  }

  searchIcons(searchTerm: string): Observable<any> {
    const results: any[] = [];
    if (searchTerm.length < 2) {
      return new Observable((observer) => {
        observer.next(results);
        observer.complete();
      });
    }
    siteData.forEach((set) => {
      set.icons.forEach((icon) => {
        if (icon.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          const result = { ...icon } as any;
          result.setName = set.setName;
          result.setDisplayName = set.displayName;
          results.push(result);
        }
        icon.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            const result = { ...icon } as any;
            result.setName = set.setName;
            result.setDisplayName = set.displayName;
            results.push(result);
          }
        });
      });
    });
    return new Observable((observer) => {
      observer.next(results);
      observer.complete();
    });
  }
}
