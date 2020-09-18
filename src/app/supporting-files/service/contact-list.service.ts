import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContact } from '../model/contact';
import { SessionService } from './session.service';
import { SESSION_KEY } from '../constants/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ContactListService {

  // API-ENDPOINT
  private url = 'assets/json/contacts.json';

  constructor(
    private httpClient: HttpClient,
    private sessionService: SessionService) { }

  /**
   * @description - Method to load contact list.
   */
  public getContactList(): void {
    this.httpClient.get<IContact[]>(this.url).subscribe((contactList: IContact[]) => {
      if (sessionStorage.getItem(SESSION_KEY) === null || sessionStorage.getItem(SESSION_KEY).length === 0) {
        const list = contactList[`contact`];
        this.sessionService.set(SESSION_KEY, list);
      }
    });
  }

  /**
   * @description - Method to load contact list.
   */
  public loadContactList(): Observable<IContact[]> {
    return this.httpClient.get<IContact[]>(this.url);
  }

}
