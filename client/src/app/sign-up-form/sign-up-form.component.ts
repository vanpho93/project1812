import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})

export class SignUpFormComponent implements OnInit {
  formSignUp: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.formSignUp = new FormGroup ({
      email: new FormControl('', gmail),
      password: new FormControl('', Validators.required),
      rePassword: new FormControl('', Validators.required)
    }, passwordsMustMatch);
  }
  
  onSubmitForm() {
    console.log(this.formSignUp.value);
  }

  getShouldShowEmailWarning(controlName) {
    const emailControl = this.formSignUp.get(controlName);
    return emailControl.invalid && emailControl.touched;
  }
}

function passwordsMustMatch(formGroup: FormGroup) : ValidationErrors | null {
  const pw1 = formGroup.get('password');
  const pw2 = formGroup.get('rePassword');
  if (pw1.value !== pw2.value) return { error: 'passwordsMustMatch' };
  return null;
}

function gmail(control: AbstractControl): ValidationErrors | null {
  if ((control.value as string).trim().endsWith('@gmail.com')) return null;
  return { error: 'gmail' };
}
