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

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { isEqual } from 'lodash';
import { ModalsService } from "@core/services/modals.service";
import { ChangeDetectorRef } from '@angular/core';

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
  public rolesData:any;

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
    public httpService: CoreHttpService,
    private http: HttpClient,
    private _router: Router,
    private _toastrService: ToastrService,
    public modalsService:ModalsService,
    private cdRef: ChangeDetectorRef

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
      formData.append("id", this.currentRow.user.id);
      formData.append("church_id",this.currentRow.church_id)
      formData.append("dob", this.currentRow.user.dob);
      formData.append("email", this.currentRow.user.email);
      formData.append("gender", this.currentRow.user.gender);
      formData.append("location", this.currentRow.user.location);
      formData.append("mobile_no", this.currentRow.user.mobile_no);
      formData.append("user_name", this.currentRow.user.user_name);
      if(this.currentRow.role_id=="Other"){
        formData.append("role_id", '0');
      }
      else{
      formData.append("role_id", this.currentRow.role_id);}
      formData.append("role_name", this.currentRow.role_name);
      formData.append("role_permissions", JSON.stringify(this.currentRow.modules));

      let request;
      this.currentRow.user.image = this.image;
      request = {
        params: { row: this.currentRow, file: formData },
        action_url: "update_subadmin",
        method: "POST",
      };
      this.http
        .post<any>(this.apiUrl + "api/update_subadmin", formData)
        .subscribe(
          (res: any) => {
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
    this.getRoles();
    this.getSingleAdmin();
  }
  getData() {
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
            console.log("churches data",this.churcesData);
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
             res.data[0].church_id= res.data[0].church_id.toString();
            this.currentRow = this.modalsService.replaceNullsWithEmptyStrings( res.data[0]);
            if (this.currentRow.avatar) {
              this.avatarImage = this.apiUrl + this.currentRow.avatar;
            }
            this.originalFormValues = { ...this.currentRow };
            this.tempRow = cloneDeep(this.currentRow);
          }
        }
        console.log("total data console",this.currentRow);
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

    this.formModified = !isEqual(this.currentRow, this.originalFormValues);
  }
  getRoles(){
    this.loading=true;
    let request;
    request = {
      params: null,
      action_url: "get_roles",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.rolesData=res.data;
         
          }
        }
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
      }
    );
  }
  onCheckboxChange(type:any,index:any) {
    // console.log("before", this.currentRow.modules[index].permissions[0].read);
    // debugger;

    if(type=='read'){
      this.currentRow.modules[index].permissions[0].read=!this.currentRow.modules[index].permissions[0].read;


    }else  if(type=='update'){
      this.currentRow.modules[index].permissions[0].update=!this.currentRow.modules[index].permissions[0].update;

    } else if(type=='create'){
      this.currentRow.modules[index].permissions[0].create=!this.currentRow.modules[index].permissions[0].create;

    }
    else{
      this.currentRow.modules[index].permissions[0].delete=!this.currentRow.modules[index].permissions[0].delete;

    }
    this.cdRef.detectChanges();
    this.checkFormModified();
  }
}
