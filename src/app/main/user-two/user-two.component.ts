import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isPresent } from 'src/app/supporting-files/constants/constant';
import { SessionService } from 'src/app/supporting-files/service/session.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-two',
  templateUrl: './user-two.component.html',
  styleUrls: ['./user-two.component.scss']
})

export class UserTwoComponent implements OnInit, OnDestroy {

  // Initialize component variables.
  public chatBox2 = new FormControl();
  public receivedMessage = null;
  public today: number = Date.now();
  public isPresent = isPresent;
  public chatMessageList = [];

  // Access modifier - private.
  private messageSubscription: Subscription;

  @Input() public selectedUserB: string;
  @Output() closeChat = new EventEmitter<boolean>();
  @ViewChild('chatBox2Ref') chatBox2Ref;

  constructor(private sessionService: SessionService) {
    this.messageSubscription = this.sessionService.message$.pipe(debounceTime(1000)).subscribe((receivedMessage: string) => {
      this.receivedMessage = receivedMessage;
      this.chatMessageList.push(receivedMessage.trim());
    });
  }

  ngOnInit(): void {
    this.chatBox2.setValidators(Validators.required);
    this.chatBox2.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.messageSubscription.unsubscribe();
    this.chatMessageList = [];
  }

  /**
   * @description - Method to send message.
   */
  public sendMessage(): void {
    if (isPresent(this.chatBox2.value) && this.chatBox2.valid) {
      this.sessionService.updateMessage(this.chatBox2.value);
      this.chatBox2.patchValue(null, { onlySelf: true });
      this.chatBox2Ref.nativeElement.focus();
    }
  }

  /**
   * @description - Method to end chat.
   */
  public endChat(): void {
    this.closeChat.emit(true);
  }

}
