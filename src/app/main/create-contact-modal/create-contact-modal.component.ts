import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContact } from 'src/app/supporting-files/model/contact';

@Component({
  selector: 'app-create-contact-modal',
  templateUrl: './create-contact-modal.component.html',
  styleUrls: ['./create-contact-modal.component.scss']
})

export class CreateContactModalComponent implements OnChanges, AfterViewInit {

  // Initialize Component Variables.
  public contactFormGroup: FormGroup;
  public isSave = true;

  // Reference HTML Elements.
  @ViewChild('nameRef') nameRef: ElementRef;

  @Input() selectedContactObj: IContact;
  @Output() triggerCloseModal = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createContactFormGroup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[`selectedContactObj`].currentValue !== null) {
      this.isSave = false;
      const editContactObj: IContact = changes[`selectedContactObj`].currentValue;
      this.contactFormGroup.get('name').disable({ onlySelf: true});
      this.contactFormGroup.setValue({
        name: editContactObj.name,
        email: editContactObj.email,
        phone: editContactObj.phone,
        company: editContactObj.company,
        address: editContactObj.address
      });
    }
  }

  ngAfterViewInit(): void {
    this.nameRef.nativeElement.focus();
  }

  /**
   * @description - Method to create form builder.
   */
  private createContactFormGroup(): void {
    this.contactFormGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      company: [null, [Validators.required]],
      address: null
    });
  }

  /**
   * @description - Method to close modal.
   */
  public closeModal(): void {
    this.triggerCloseModal.emit(null);
  }

  /**
   * @description - Method to submit contact.
   */
  public submitContact(): void {
    if (this.contactFormGroup.valid) {
      if (!this.isSave) {
        this.triggerCloseModal.emit({
          status: 'edit',
          contactObj: JSON.parse(JSON.stringify(this.contactFormGroup.getRawValue()))
        });
      } else {
        this.triggerCloseModal.emit({
          status: 'create',
          contactObj: JSON.parse(JSON.stringify(this.contactFormGroup.getRawValue()))
        });
      }
    }
  }

  /**
   * @description - Name property is returned.
   */
  public get name(): AbstractControl {
    return this.contactFormGroup.get('name');
  }

  /**
   * @description - Email property is returned.
   */
  public get email(): AbstractControl {
    return this.contactFormGroup.get('email');
  }

  /**
   * @description - Phone property is returned.
   */
  public get phone(): AbstractControl {
    return this.contactFormGroup.get('phone');
  }

  /**
   * @description - Company property is returned.
   */
  public get company(): AbstractControl {
    return this.contactFormGroup.get('company');
  }

  /**
   * @description - Address property is returned.
   */
  public get address(): AbstractControl {
    return this.contactFormGroup.get('address');
  }

}
