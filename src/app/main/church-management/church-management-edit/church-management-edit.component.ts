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
import { CoreHttpService } from "@core/services/http.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-church-management-edit",
  templateUrl: "./church-management-edit.component.html",
  styleUrls: ["./church-management-edit.component.scss"],
 
})
export class ChurchManagementEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public image: any;
  public apiUrl: any;
  public loading:boolean=false;
  public adminsData:any;
  public buttonLoading:boolean=false;
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
    private http: HttpClient,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    private _router: Router,
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
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    this.loading=true;
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
    this.loading=false;
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.buttonLoading=true;
    if (form.valid) {
      const formData = new FormData();
      formData.append("image", this.image);

      // Append form data fields
      formData.append("id", this.currentRow.id);
      formData.append("admin_id", this.currentRow.admin_id);
      formData.append("avatar", this.currentRow.avatar);
      formData.append("church_address", this.currentRow.church_address);
      formData.append("church_name", this.currentRow.church_name);
      formData.append("city", this.currentRow.city);
      formData.append("country", this.currentRow.country);
      formData.append("denomination", this.currentRow.denomination);
      formData.append("email", this.currentRow.email);
      formData.append("language", this.currentRow.language);
      formData.append("location", this.currentRow.location);
      formData.append("mobile_no", this.currentRow.mobile_no);
      formData.append("pastor_name", this.currentRow.pastor_name);
      formData.append("users", this.currentRow.users);
      formData.append("website", this.currentRow.website);

      let request;
      this.currentRow.image = this.image;
      request = {
        params: { row: this.currentRow, file: formData },
        action_url: "update_church",
        method: "POST",
      };
      console.log("request", request);
      this.http
        .post<any>(this.apiUrl+"api/update_church", formData)
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
                this._toastrService.success(
                  res.msg,
                  'Success',
                  { toastClass: 'toast ngx-toastr', closeButton: true }
                );
                this._router.navigate(["../church-management"]);
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
      this.buttonLoading=false;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getData();
    this.getSingleChurch();
  }
  getSingleChurch() {
    this.loading=true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_church",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.currentRow = res.data;
            if(this.currentRow.avatar){
            this.avatarImage = this.apiUrl+this.currentRow.avatar;}
            this.tempRow = cloneDeep(this.currentRow);
            console.log("rows values", this.currentRow);
          }
        }
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
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
  getData() {
    console.log("@gb getdata called ");
    let request = {
      params: null,
      action_url: "get_admins",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.adminsData = res.data;
            console.log("rowss", this.adminsData);
          }
        }
      },
      (error: any) => {}
    );
  }
}
