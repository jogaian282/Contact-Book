import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IContact } from '../model/contact';

@Injectable({
  providedIn: 'root'
})

export class SessionService {

  // Initialize component variables.
  private updatedContactObj = new Subject<IContact>();
  private selectedChatUser = new Subject<string>();
  private message = new Subject<string>();

  public contactObj$ = this.updatedContactObj.asObservable();
  public chatUser$ = this.selectedChatUser.asObservable();
  public message$ = this.message.asObservable();

  constructor() { }

  /**
   * @description - Method to set data in storage.
   * @param - key
   * @param - data
   */
  set(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to sessionStorage', e);
    }
  }

  /**
   * @description - Method to get data in storage.
   * @param - { string } any.
   */
  get(key: string): any {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from sessionStorage', e);
      return null;
    }
  }

  /**
   * @description - Method to update contact object.
   * @param - {IContact} newContactObj.
   */
  public updateContactList(newContactObj: IContact): void {
    this.updatedContactObj.next(newContactObj);
  }

  /**
   * @description - Method to multicast selected user.
   * @param - {string} user.
   */
  public selectUser(user: string): void {
    this.selectedChatUser.next(user);
  }

  /**
   * @description - Method to multicast message.
   * @param - {string} message.
   */
  public updateMessage(message: string): void {
    this.message.next(message);
  }

}
