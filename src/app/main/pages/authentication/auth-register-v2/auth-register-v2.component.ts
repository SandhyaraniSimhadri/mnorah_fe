import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CoreHttpService } from "@core/services/http.service";
import { CoreConfigService } from "@core/services/config.service";
import { Router } from "@angular/router";

declare var gapi: any;
@Component({
  selector: "app-auth-register-v2",
  templateUrl: "./auth-register-v2.component.html",
  styleUrls: ["./auth-register-v2.component.scss"],
 
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: UntypedFormGroup;
  public submitted = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  user: any;
  constructor(
    private router: Router,
    public httpService: CoreHttpService,
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.registerForm.invalid) {
    //   return;
    // }

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    let user_val = this.registerForm.value;
    let email = user_val.email;
    let pwd = user_val.password;
    let username = user_val.username;
    let phone = user_val.phone;
    let churchname = user_val.churchname;
    let users = user_val.users;
    let location = user_val.location;
    let pastorname = user_val.pastorname;
    let denomination = user_val.denomination;
    let city = user_val.city;
    let country = user_val.country;
    let church_address = user_val.church_address;
    let website = user_val.website;
    
    let request;

    request = {
      params: { email: email, 
        password: pwd, 
        username: username, 
        phone: phone,
        churchname: churchname,
        users: users,
        location: location,
        pastorname: pastorname,
        denomination: denomination,
        city:city,
        country: country,
        church_address: church_address,
        website: website,
      },
      action_url: "register",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.router.navigate(["/login"]);
          }
        }
      },
      (error: any) => {}
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      phone: ["", Validators.required],
      churchname: ["", Validators.required],
      users: ["", Validators.required],
      location: ["", Validators.required],
      pastorname: ["", Validators.required],
      denomination: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      church_address: ["", Validators.required],
      website: ["", Validators.required],
    });

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
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

}
