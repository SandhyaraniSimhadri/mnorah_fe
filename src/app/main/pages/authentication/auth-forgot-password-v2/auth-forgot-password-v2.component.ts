import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-forgot-password-v2',
  templateUrl: './auth-forgot-password-v2.component.html',
  styleUrls: ['./auth-forgot-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthForgotPasswordV2Component implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: UntypedFormGroup;
  public forgotPasswordOTPForm: UntypedFormGroup;
  public resetPasswordForm: UntypedFormGroup;

  public submitted = false;
  public data:any;
  public user_data:any;

  public loading:boolean=false;
  // Private
  private _unsubscribeAll: Subject<any>;
  public showConfirmPassword=false;
  showNewPassword = false;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(private _coreConfigService: CoreConfigService, private _formBuilder: UntypedFormBuilder,  public httpService: CoreHttpService,
    private _toastrService: ToastrService, private _router: Router,) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  get g() {
    return this.forgotPasswordOTPForm.controls;
  }
  get c() {
    return this.resetPasswordForm.controls;
  }
  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.forgotPasswordOTPForm = this._formBuilder.group({
      otp: ['', [Validators.required]]
    });
    this.resetPasswordForm = this._formBuilder.group({
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]

    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  sentOTP(){
    this.submitted = true;
    this.loading=true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      this.loading=false;
    this.submitted = false;

      return;
    }

    let user_val = this.forgotPasswordForm.value;
    let email = user_val.email;
    let request = {
      params: { email: email },
      action_url: "sent_OTP",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
      this.loading=false;
      this.submitted = false;

        if (res == "nonet") {
        } else {
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this.data= res.data;
            this._toastrService.success(res.msg, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        }
      },
      (error: any) => {
      this.loading=false;
      this.submitted = false;

      }
    );
  }

  verifyOTP(){
    this.submitted = true;
    this.loading=true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      this.loading=false;
    this.submitted = false;

      return;
    }

    let user_val = this.forgotPasswordForm.value;
    let otp_val = this.forgotPasswordOTPForm.value;
    
    let email = user_val.email;
    let otp = otp_val.otp;
    let request = {
      params: { email: email, otp:otp },
      action_url: "verify_OTP",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
      this.loading=false;
      this.submitted = false;

        if (res == "nonet") {
        } else {
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this.user_data= res.data;
            this._toastrService.success(res.msg, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        }
      },
      (error: any) => {
      this.loading=false;
      this.submitted = false;

      }
    );
  }

  updatePassword(){
    this.submitted = true;
    this.loading=true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      this.loading=false;
    this.submitted = false;

      return;
    }
    let password_val = this.resetPasswordForm.value;
    let new_password = password_val.new_password;
    let confirm_password = password_val.confirm_password;
    if(new_password!=confirm_password){
      this._toastrService.error('New password and confirm password should be same', "Failed", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      this.loading=false;
    this.submitted = false;
      
      return;
    }
  
    let user_val = this.forgotPasswordForm.value;
    let otp_val = this.forgotPasswordOTPForm.value;
    
    let email = user_val.email;
    let otp = otp_val.otp;
    let request = {
      params: { email: email, otp:otp,confirm_password:confirm_password },
      action_url: "update_password",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
      this.loading=false;
      this.submitted = false;

        if (res == "nonet") {
        } else {
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            if(res.msg=='Duplicate'){
              this._toastrService.error('Your new password must be different from your previous used password', "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            }else{
              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this._router.navigate(["/pages/authentication/login-v2"]);
            }
           
          }
        }
      },
      (error: any) => {
      this.loading=false;
      this.submitted = false;

      }
    );
  }
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
