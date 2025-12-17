import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  setSearch(value: string) {
    this.searchSubject.next(value);
  }

  get currentSearch() {
    return this.searchSubject.value;
  }

  clear() {
    this.searchSubject.next('');
  }
}
