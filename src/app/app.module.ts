import { SearchPipe } from './supporting-files/pipe/search.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { UserOneComponent } from './main/user-one/user-one.component';
import { UserTwoComponent } from './main/user-two/user-two.component';
import { CreateContactModalComponent } from './main/create-contact-modal/create-contact-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactListService } from './supporting-files/service/contact-list.service';

// tslint:disable-next-line:typedef
export function loadContactList(contactService: ContactListService) {
  return () => contactService.getContactList();
}

export const APP_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: loadContactList,
    deps: [ContactListService],
    multi: true
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    CreateContactModalComponent,
    UserOneComponent,
    UserTwoComponent,
    SearchPipe
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    APP_PROVIDERS
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
