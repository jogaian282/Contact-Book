import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { IContact } from '../supporting-files/model/contact';
import { SessionService } from '../supporting-files/service/session.service';
import * as bulmaToast from 'bulma-toast';
import { SESSION_KEY, isPresent, SESSION_USER_KEY } from '../supporting-files/constants/constant';
import { Subscription } from 'rxjs';
import { ContactListService } from '../supporting-files/service/contact-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  // Initialize variables.
  public isToggleMenu = false;
  public contactList: IContact[];

  // Access modifier - private.
  private contactObjSubscription: Subscription;

  constructor(
    private sessionService: SessionService,
    private contactService: ContactListService
  ) {
    this.contactObjSubscription = this.sessionService.contactObj$.subscribe((contactObj: IContact) => {
      if (isPresent(contactObj)) {
        this.getContactList();
      }
    });
  }

  ngOnInit(): void {
    this.getContactList();
  }

  ngOnDestroy(): void {
    this.contactObjSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    const innerWidth = event.target.innerWidth;
    if (innerWidth <= 767) {
      this.isToggleMenu = false;
    }
  }

  /**
   * @description- Method to get contact list.
   */
  private getContactList(): void {
    this.contactService.loadContactList().subscribe((contactList: IContact[]) => {
      this.contactList = contactList[`contact`];
    });
  }

  /**
   * @description - Method to toggle menu.
   */
  public toggleMenu(): void {
    this.isToggleMenu = !this.isToggleMenu;
  }

  /**
   * @description - Method to select contact user on change.
   * @param - {string} selectedUser.
   */
  public onSelectContact(selectedUser: string): void {
    if (isPresent(selectedUser)) {
      this.sessionService.set(SESSION_USER_KEY, JSON.stringify(selectedUser));
      this.sessionService.selectUser(selectedUser);
      bulmaToast.toast({
        message: `Initiated chat. Click chat icon to proceed...`,
        type: 'is-warning',
        position: 'top-center',
        duration: 3000
      });
    } else {
      sessionStorage.removeItem(SESSION_USER_KEY);
    }
  }

}
