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
import { ModalsService } from "@core/services/modals.service";
import { isEqual } from 'lodash';

@Component({
  selector: "app-member-management-edit",
  templateUrl: "./member-management-edit.component.html",
  styleUrls: ["./member-management-edit.component.scss"],
 
})
export class MemberManagementEditComponent implements OnInit, OnDestroy {
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
  public churcesData: any;
  public selectMultiGroupSelected = [];
  public selectGroupselected: any[] = [];
  public enableVolunteering: any = false;
  public enableAttending: any = false;
  public loading: boolean = false;
  public buttonLoading: boolean = false;
  public originalFormValues: any;
  public formModified: boolean = false;

  public selectGroup = [
    {
      name: "I am interested in becoming a member.",
      country: "I am interested in becoming a member.",
    },
    {
      name: "Ushering",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Children's Ministry",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Music Ministry",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Sunday School",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Other (please specify)",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Sunday Service",
      country: "I am interested in attending the following events:",
    },
    {
      name: "Bible Study",
      country: "I am interested in attending the following events:",
    },

    {
      name: "Fellowship Events",
      country: "I am interested in attending the following events:",
    },
    {
      name: "Community Outreach",
      country: "I am interested in attending the following events:",
    },
    {
      name: "Other (please specify):",
      country: "I am interested in attending the following events:",
    },
  ];
  
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
    public httpService: CoreHttpService,
    private http: HttpClient,
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
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.checkFormModified();

  }

  /**
   * Submit
   *
   * @param form
   */
  

  submit(form) {

    if (form.valid) {
      this.buttonLoading=true;

      const formData = new FormData();
      formData.append("image", this.image);
      this.currentRow.invovlement = this.selectMultiGroupSelected.toString();
      // Append form data fields
      formData.append("id", this.currentRow.id);
      formData.append("dob", this.currentRow.dob);
      formData.append("email", this.currentRow.email);
      formData.append("gender", this.currentRow.gender);
      formData.append("location", this.currentRow.location);
      formData.append("mobile_no", this.currentRow.mobile_no);
      formData.append("user_name", this.currentRow.user_name);
      formData.append("state", this.currentRow.state);
      formData.append("comments", this.currentRow.comments);

      formData.append(
        "invovlement_interest",
        this.currentRow.invovlement
      );
      formData.append("membership_status", this.currentRow.membership_status);
      formData.append("church_id", this.currentRow.church_id);
      formData.append(
        "membership_status_other",
        this.currentRow.membership_status_other
      );
      formData.append("hear_about_church", this.currentRow.hear_about_church);
      formData.append(
        "hear_about_church_other",
        this.currentRow.hear_about_church_other
      );
      formData.append(
        "invovlement_interest_volunteering",
        this.currentRow.invovlement_interest_volunteering
      );
      formData.append(
        "invovlement_interest_attending",
        this.currentRow.invovlement_interest_attending
      );
      this.currentRow.image = this.image;
      this.http
        .post<any>(this.apiUrl + "api/update_member", formData)
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
                this.router.navigate(["../member-management"]);
              }
            }
            this.buttonLoading=false;
          },
          (error: any) => {
            this.buttonLoading=false;
          }
        );
    }
  }


  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getData();
    this.getSingleMember();
  }

  getSingleMember() {
    this.loading = true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_member",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            res.data.church_id=res.data.church_id.toString();
            this.currentRow = this.modalsService.replaceNullsWithEmptyStrings(res.data);
            this.originalFormValues = { ...this.currentRow };

            this.currentRow.invovlement_interest = null;
            this.selectMultiGroupSelected =[]
          
            this.avatarImage = this.apiUrl + this.currentRow.avatar;
            this.tempRow = cloneDeep(this.currentRow);
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
          }
        }
      },
      (error: any) => {}
    );
  }
  checkOther(event: any) {

    if (!this.selectMultiGroupSelected.includes(event.target.innerText)) {
      if (event.target.innerText !== "") {
        this.selectMultiGroupSelected.push(event.target.innerText);
        if (event.target.innerText == "Other (please specify)") {
          this.enableVolunteering = true;
        }
        if (event.target.innerText == "Other (please specify):") {
          this.enableAttending = true;
        }
      }
    } else {
      let idx = this.selectMultiGroupSelected.indexOf(event.target.innerText);
      this.selectMultiGroupSelected.splice(idx, 1);
      if (event.target.innerText == "Other (please specify)") {
        this.enableVolunteering = false;
      }
      if (event.target.innerText == "Other (please specify):") {
        this.enableAttending = false;
      }
    }
    // this.checkFormModified();
    this.formModified=true;

  }
  checkFormModified() {
   
    this.formModified = !isEqual(this.currentRow, this.originalFormValues);
  }
}
