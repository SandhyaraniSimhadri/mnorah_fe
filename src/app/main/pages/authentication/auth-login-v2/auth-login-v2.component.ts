import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { takeUntil, first } from "rxjs/operators";
import { Subject } from "rxjs";

import { AuthenticationService } from "app/auth/service";
import { CoreConfigService } from "@core/services/config.service";
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-auth-login-v2",
  templateUrl: "./auth-login-v2.component.html",
  styleUrls: ["./auth-login-v2.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLoginV2Component implements OnInit {
  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  public coreConfig: any;
  public loginForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService
  ) {
    // redirect to home if already logged in
    if (this._authenticationService.currentUserValue) {
      this._router.navigate(["/"]);
    }

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
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.error = "";
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    console.log("@log loginForm: ", this.loginForm.value);

    // Login
    this.loading = true;
    let user_val = this.loginForm.value;
    let email = user_val.email;
    let pwd = user_val.password;
    this._authenticationService
      .login(email, pwd)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log("data", data);
          const user = data;
          if (data.status) {
            localStorage.setItem("currentUser", JSON.stringify(user.data));

            setTimeout(() => {
              this._toastrService.success(
                "You have successfully logged in. Now you can start to explore. Enjoy! 🎉",
                "👋 Welcome !",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
            this._router.navigate([this.returnUrl]);
          } else {
            setTimeout(() => {
              this._toastrService.error(
                data.msg,
                "Failed",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
          }
          this.loading=false;
        },
        (error) => {
          console.log("@log error: ", error);
          this.error = error;
          this.loading = false;
        }
      );

    return;
      }
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email],
      ],
      password: ["", Validators.required],
      username: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

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
