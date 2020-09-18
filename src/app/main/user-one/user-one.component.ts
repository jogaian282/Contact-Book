import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isPresent } from 'src/app/supporting-files/constants/constant';
import { SessionService } from 'src/app/supporting-files/service/session.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-one',
  templateUrl: './user-one.component.html',
  styleUrls: ['./user-one.component.scss']
})

export class UserOneComponent implements OnInit, OnDestroy {

  // Initialize component variables.
  public chatBox1 = new FormControl();
  public receivedMessage = null;
  public today: number = Date.now();
  public isPresent = isPresent;
  public chatMessageList = [];

  // Access modifier - private.
  private messageSubscription: Subscription;

  @Input() selectedUserA: string;
  @Output() closeChat = new EventEmitter<boolean>();
  @ViewChild('chatBox1Ref') chatBox1Ref;

  constructor(private sessionService: SessionService) {
    this.messageSubscription = this.sessionService.message$.pipe(debounceTime(1000)).subscribe((receivedMessage: string) => {
      this.receivedMessage = receivedMessage;
      this.chatMessageList.push(receivedMessage.trim());
    });
  }

  ngOnInit(): void {
    this.chatBox1.setValidators(Validators.required);
    this.chatBox1.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.chatMessageList = [];
  }

  /**
   * @description - Method to send message.
   */
  public sendMessage(): void {
    if (isPresent(this.chatBox1.value) && this.chatBox1.valid) {
      this.sessionService.updateMessage(this.chatBox1.value);
      this.chatBox1.patchValue(null, { onlySelf: true });
      this.chatBox1Ref.nativeElement.focus();
    }
  }

  /**
   * @description - Method to end chat.
   */
  public endChat(): void {
    this.closeChat.emit(true);
  }

}
