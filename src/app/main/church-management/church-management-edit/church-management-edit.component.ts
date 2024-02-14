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
import { isEqual } from 'lodash';

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
  public loading: boolean = false;
  public adminsData: any;
  public buttonLoading: boolean = false;
  @ViewChild("accountForm") accountForm: NgForm;
  public customTag: any[] = [];
  public customTagselected: any = [];
  public admins_list: any=[];
  public originalFormValues: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  formModified: boolean = false;
  public selectMultiLanguages = [
    "English",
    "Spanish",
    "French",
    "Russian",
    "German",
    "Arabic",
    "Sanskrit",
  ];
  public countriesData:any;
  public citiesData: any;
  public selected_country:any;
  public selectMultiLanguagesSelected = [];
  public selectedMembers:any=[];

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
    private _router: Router
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
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.image = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.loading = false;
    this.checkFormModified();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    var i = 0;
    if (Array.isArray(this.customTagselected)) {
      for (var i = 0; i < this.customTagselected.length; i++) {
        this.admins_list.push(this.customTagselected[i].id);
      }
    }
    this.buttonLoading = true;
    if (form.valid) {
      const formData = new FormData();
      formData.append("image", this.image);

      // Append form data fields
      formData.append("id", this.currentRow.id);
      formData.append("admins", this.currentRow.admin_id);
      formData.append("avatar", this.currentRow.image);
      formData.append("address", this.currentRow.address);
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
      formData.append("admins_count", this.customTagselected.length);
      formData.append("admins_list", this.admins_list);

      let request;
      this.currentRow.image = this.image;
      request = {
        params: { row: this.currentRow, file: formData },
        action_url: "update_church",
        method: "POST",
      };
      this.http
        .post<any>(this.apiUrl + "api/update_church", formData)
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
                this._router.navigate(["../church-management"]);
              }
            }
            this.buttonLoading = false;
            this.formModified = false;
          },
          (error: any) => {
            this.buttonLoading = false;
          }
        );
    } else {
      this.buttonLoading = false;
    }
  }



  checkFormModified() {
    let formModified1=false;
    let formModified2 = false;
  formModified1 = !isEqual(this.currentRow, this.originalFormValues);
   formModified2 = !isEqual(this.customTagselected, this.selectedMembers);
   if(formModified1 || formModified2){
     this.formModified=true;
   }else{
     this.formModified=false;
   }
    // this.formModified = !isEqual(this.currentRow, this.originalFormValues);
  }
  // isEqual(obj1: any, obj2: any): boolean {
  //   return JSON.stringify(obj1) === JSON.stringify(obj2);
  // }
  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getAdmins();
    this.getCountries();
    this.getSingleChurch();
  }
  getSingleChurch() {
    this.loading = true;
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
            this.getCities(this.currentRow.country);

            // this.currentRow.country="101";
            if (this.currentRow.image) {
              this.avatarImage = this.apiUrl + this.currentRow.image;
            }
            this.tempRow = cloneDeep(this.currentRow);
            if(this.currentRow.admin_ids){
            this.currentRow.admin_ids = this.currentRow.admin_ids.split(",");
            this.currentRow.admins = this.currentRow.admins.split(",");
            this.originalFormValues = { ...this.currentRow };
            this.currentRow.admin_ids.forEach((c, i) => {
              this.customTagselected.push({
                id: parseInt(c),
                name: this.currentRow.admins[i],
              });
              this.customTag.push({ id: c, name: this.currentRow.admins[i] });
            });
          }
          else{
            this.originalFormValues = { ...this.currentRow };
            this.selectedMembers = [...this.customTagselected];
          }
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
  getAdmins() {
    let request = {
      params: null,
      action_url: "get_admins_for_new_church",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.adminsData = res.data;

            this.adminsData.forEach((c, i) => {
              this.customTag.push({ id: c.id, name: c.user_name });
            });
          }
        }
      },
      (error: any) => {}
    );
  }
  getCountries() {
    let request = {
      params: null,
      action_url: "get_countries",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.countriesData = res.data;
           
          }
        }
      },
      (error: any) => {}
    );
  }
  getCities(name) {
    console.log("cities");
    this.currentRow.city = '';
    let request = {
      params:  { countryCode: name },
      action_url: "get_cities",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.citiesData = res.data;
            console.log("data city",this.citiesData);
            this.checkFormModified();
          }
        }
      },
      (error: any) => {}
    );
  }
}
