import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IContact } from '../supporting-files/model/contact';
import { SearchPipe } from '../supporting-files/pipe/search.pipe';
import { SessionService } from '../supporting-files/service/session.service';
import { SESSION_KEY, isPresent } from '../supporting-files/constants/constant';
import * as bulmaToast from 'bulma-toast';
import { ContactListService } from '../supporting-files/service/contact-list.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [SearchPipe]
})

export class MainComponent implements OnInit, OnDestroy {

  // Initialize component essential variables.
  public showModal = false;
  public contactList: IContact[];
  public searchContact = new FormControl();
  public selectedContact = null;
  public selectedContactIndex = null;
  public editContactObj = null;
  public selectedUserA = null;
  public selectedUserB = null;
  public isPresent = isPresent;

  // Access modifiers - private.
  private searchValue: Subject<string> = new Subject<string>();
  private clonedContactList: IContact[];
  private searchValueSubscription: Subscription;
  private chatUserSubscription: Subscription;

  constructor(
    private sessionService: SessionService,
    private contactService: ContactListService,
    private searchPipe: SearchPipe) {
    this.searchValueSubscription = this.searchValue.pipe(debounceTime(500))
    .subscribe((enteredValue: string) => {
      this.contactList = this.searchPipe.transform(this.sessionService.get(SESSION_KEY), enteredValue);
    });
    this.sessionService.chatUser$.subscribe((selectedUser: string) => {
      if (isPresent(selectedUser)) {
        this.selectedUserA = selectedUser;
        this.contactList = this.sessionService.get(SESSION_KEY).filter((contactObj: IContact) => {
          return contactObj.name.toLowerCase() !== selectedUser.toLowerCase();
        });
        this.selectedContact = null;
        this.selectedContactIndex = null;
      }
    });
  }

  ngOnInit(): void {
    this.getContactList();
  }

  ngOnDestroy(): void {
    this.searchValueSubscription.unsubscribe();
    this.chatUserSubscription.unsubscribe();
    this.selectedContact = null;
    this.selectedContactIndex = null;
    this.selectedUserA = null;
    this.selectedUserB = null;
    sessionStorage.clear();
  }

  /**
   * @description- Method to get contact list.
   */
  private getContactList(): void {
    if (sessionStorage.getItem(SESSION_KEY) === null || sessionStorage.getItem(SESSION_KEY).length === 0) {
      this.contactService.loadContactList().subscribe((contactList: IContact[]) => {
        this.contactList = contactList[`contact`];
        this.clonedContactList = Object.assign([], this.contactList);
      });
    } else {
      this.contactList = this.sessionService.get(SESSION_KEY);
      this.clonedContactList = Object.assign([], this.contactList);
    }
  }

  /**
   * @description - Method to open modal.
   * @param - { IContact } selectedContactObj.
   */
  public openAddCompanyModal(selectedContactObj: IContact): void {
    this.showModal = true;
    if (isPresent(selectedContactObj)) {
      this.editContactObj = Object.assign({}, selectedContactObj);
    } else {
      this.editContactObj = null;
    }
  }

  /**
   * @description - Method to search bill item.
   * @param - { string } search.
   */
  public onSearchContact(searchValue: string): void {
    this.selectedUserA = null;
    this.selectedUserB = null;
    this.searchValue.next(searchValue);
  }

  /**
   * @description - Method to close modal.
   * @param - { any} eventObj.
   */
  public onCloseModal(eventObj: any): void {
    this.showModal = false;
    if (isPresent(eventObj) && eventObj.status.includes('edit')) {
      this.clonedContactList = this.clonedContactList.
      filter(((contactObj: IContact) => contactObj.name.toLowerCase() !== eventObj.contactObj.name.toLowerCase()));
      this.contactList = [...this.clonedContactList, eventObj.contactObj];
      this.sessionService.set(SESSION_KEY, this.contactList);
      bulmaToast.toast({
        message: `Contact has been successfully updated.`,
        type: 'is-success',
        position: 'top-center'
      });
    } else if (isPresent(eventObj) && eventObj.status.includes('create')) {
      this.contactList = [...this.clonedContactList, eventObj.contactObj];
      this.sessionService.set(SESSION_KEY, this.contactList);
      this.sessionService.updateContactList(eventObj.contactObj);
      bulmaToast.toast({
        message: `Contact has been successfully created.`,
        type: 'is-success',
        position: 'top-center'
      });
    }

  }

  /**
   * @description - Method to show contact detail.
   * @param - { IContact} contactObj.
   * @param - { number } index.
   */
  public showContactDetail(contactObj: IContact, selectedIndex: number): void {
    this.endChat(true);
    this.selectedContact = contactObj;
    this.selectedContactIndex = selectedIndex;
  }

  /**
   * @description - Method to open chat.
   * @param - { string } name.
   * @param - { number } selectedContactIndex.
   */
  public openChat(name: string, selectedContactIndex: number): void {
    if (isPresent(this.selectedUserA)) {
      this.selectedUserB = name;
      this.selectedContactIndex = selectedContactIndex;
    } else {
      bulmaToast.toast({
        message: `Select contact to initiate chat.`,
        type: 'is-danger',
        position: 'top-center'
      });
    }
  }

  /**
   * @description - Method to end chat.
   * @param - { boolean } isChatClosed.
   */
  public endChat(isChatClosed: boolean): void {
    if (isChatClosed) {
      this.selectedUserA = null;
      this.selectedUserB = null;
      this.selectedContactIndex = null;
    }
  }

}
