import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";
import { cloneDeep } from "lodash";
import { UserEditService } from "./user-edit.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { isEqual } from 'lodash';
import { ModalsService } from "@core/services/modals.service";

@Component({
  selector: "app-sub-admin-edit",
  templateUrl: "./sub-admin-edit.component.html",
  styleUrls: ["./sub-admin-edit.component.scss"],
})
export class SubAdminEditComponent implements OnInit, OnDestroy {
  // Public

  public fullname;
  public gender;
  public dob;
  public email;
  public phone_number;
  public city;
  public form: any;
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public apiUrl: any;
  public image: any;
  public loading: boolean = false;
  public buttonLoading: boolean = false;
  public churcesData: any;
  public originalFormValues: any;

  @ViewChild("accountForm") accountForm: NgForm;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };

  public selectMultiLanguages = [
    "English",
    "Spanish",
    "French",
    "Russian",
    "German",
    "Arabic",
    "Sanskrit",
  ];
  public selectMultiLanguagesSelected = [];
  public formModified: boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _userEditService: UserEditService,
    public httpService: CoreHttpService,
    private http: HttpClient,
    private _router: Router,
    private _toastrService: ToastrService,
    public modalsService:ModalsService,

  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
    this.formModified = false;

  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    this.buttonLoading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      console.log("file", event.target.files[0]);
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.buttonLoading = false;
    this.checkFormModified();

  }

  /**
   * Submit
   *
   * @param form
   */

  submit(form:any) {
  
    if (form.valid) {
      this.buttonLoading=true;
      // const dateString = this.currentRow.dob;
      // const parts = dateString.split("/");
      // this.dob = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      //   .toISOString()
      //   .slice(0, 10);
      // this.currentRow.dob = this.dob;
      const formData = new FormData();
      formData.append("image", this.image);

      // Append form data fields
      formData.append("id", this.currentRow.id);
      formData.append("church_id",this.currentRow.church_id)
      formData.append("dob", this.currentRow.dob);
      formData.append("email", this.currentRow.email);
      formData.append("gender", this.currentRow.gender);
      formData.append("location", this.currentRow.location);
      formData.append("mobile_no", this.currentRow.mobile_no);
      formData.append("user_name", this.currentRow.user_name);

      let request;
      this.currentRow.image = this.image;
      request = {
        params: { row: this.currentRow, file: formData },
        action_url: "update_subadmin",
        method: "POST",
      };
      console.log("request", request);
      this.http
        .post<any>(this.apiUrl + "api/update_subadmin", formData)
        .subscribe(
          (res: any) => {
            console.log("res", res);

            console.log(res);
            if (res == "nonet") {
            } else {
              if (res.status == false) {
                this._toastrService.error(res.msg, "Failed", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
              } else if (res.status == true) {
                this._toastrService.success(res.msg, "Success", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
                this._router.navigate(["../sub-admin"]);
              }
            }
            this.buttonLoading=false;
          },
          (error: any) => {
            this.buttonLoading=false;
          }
        );
    }
    else{
      this._toastrService.error('Fill all the details', "Failed", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      this.buttonLoading=false;
    }
  }


  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getData();
    this.getSingleAdmin();
  }
  getData() {
    console.log("@gb getdata called ");
    let request = {
      params: null,
      action_url: "get_churches",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.churcesData = res.data;
            console.log("rowss", this.churcesData);
          }
        }
      },
      (error: any) => {}
    );
  }
  getSingleAdmin() {
    this.loading = true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_admin",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.currentRow = this.modalsService.replaceNullsWithEmptyStrings(res.data);
            if (this.currentRow.avatar) {
              this.avatarImage = this.apiUrl + this.currentRow.avatar;
            }
            this.originalFormValues = { ...this.currentRow };
            this.tempRow = cloneDeep(this.currentRow);
            console.log("rows values", this.avatarImage);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  checkFormModified() {
    console.log("current row",this.currentRow);
    console.log("original form row",this.originalFormValues);

    this.formModified = !isEqual(this.currentRow, this.originalFormValues);
    console.log("this.modified",this.formModified);
  }
 
}
