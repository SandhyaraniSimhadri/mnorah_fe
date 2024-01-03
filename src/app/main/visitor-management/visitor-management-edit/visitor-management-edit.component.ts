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
  selector: "app-visitor-management-edit",
  templateUrl: "./visitor-management-edit.component.html",
  styleUrls: ["./visitor-management-edit.component.scss"],
})
export class VisitorManagementEditComponent implements OnInit, OnDestroy {
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
  public churchesData: any;
  public selectMultiGroupSelected = [];
  public selectedChurchName:any;
  public loading: boolean = false;
  public buttonLoading: boolean = false;
  public originalFormValues: any;
  public formModified: boolean = false;
  public selectGroup = [
    {
      name: " I am a first-time visitor.",
      group: "Connection Card",
    },
    {
      name: "I am interested in joining a small group",
      group: "Connection Card",
    },
    {
      name: "I would like to receive updates and newsletters via email.",
      group: "Connection Card",
    },
    {
      name: "I am interested in volunteering.",
      group: "Connection Card",
    },
   

  ];
  @ViewChild("accountForm") accountForm: NgForm;

 



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
      console.log("file", event.target.files[0]);
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.checkFormModified();

  }



  submit(form) {
    console.log("validddddd",form.valid);
    if (form.valid) {
      this.buttonLoading = true;
      if(this.selectMultiGroupSelected.length>0){
        this.currentRow.connection = this.selectMultiGroupSelected.toString();}
      const formData = new FormData();
      formData.append("image", this.image);
      this.currentRow.connection = this.selectMultiGroupSelected.toString();
      // Append form data fields
      formData.append("id", this.currentRow.id);
      formData.append("church_id", this.currentRow.church_id);

      formData.append("first_name", this.currentRow.first_name ?? null);
      formData.append("last_name", this.currentRow.last_name ?? null);
      formData.append("spouse_name", this.currentRow.spouse_name ?? null);
      formData.append("child1_name", this.currentRow.child1_name ?? null);
      formData.append("child2_name", this.currentRow.child2_name ?? null);
      formData.append("child3_name", this.currentRow.child3_name ?? null);
      formData.append("child4_name", this.currentRow.child4_name ?? null);
      formData.append("phone_number", this.currentRow.phone_number ?? null);
      formData.append("email", this.currentRow.email ?? null);
      formData.append("address", this.currentRow.address ?? null);
      formData.append("city", this.currentRow.city ?? null);
      formData.append("connection", this.currentRow.connection ?? null);
      formData.append("hear_about", this.currentRow.hear_about ?? null);
      formData.append("hear_about_other", this.currentRow.hear_about_other ?? null);
      formData.append("visit_date", this.currentRow.visit_date ?? null);
      formData.append("experience", this.currentRow.experience ?? null);
      formData.append("about_visit", this.currentRow.about_visit ?? null);
      formData.append("suggestions", this.currentRow.suggestions ?? null);
      formData.append("prayer_request", this.currentRow.prayer_request ?? null);
      formData.append("comments", this.currentRow.comments ?? null);
        // console.log("dataaaa",formData.forEach(dd => console.log(dd)));
      this.currentRow.image = this.image;
      this.http
        .post<any>(this.apiUrl + "api/update_visitor", formData)
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
                this.router.navigate(["../visitor-management"]);
              }
            }
            this.buttonLoading = false;
          },
          (error: any) => {
            this.buttonLoading = false;
          }
        );
    }
  }

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getData();
    this.getSingleVisitor();
  }

  getSingleVisitor() {
    this.loading = true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_visitor",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.currentRow = this.replaceNullsWithEmptyStrings(res.data);
            this.originalFormValues = { ...this.currentRow };

            this.selectMultiGroupSelected = [];

            console.log("valuessss", this.selectMultiGroupSelected);
            this.avatarImage = this.apiUrl + this.currentRow.avatar;
         
            // this.selectMultiGroupSelected = this.currentRow.connection.split(',');
            this.tempRow = cloneDeep(this.currentRow);
            console.log("rows values", this.currentRow);
            for(var i=0;i<this.churchesData.length;i++){
              if(this.churchesData[i].id==this.currentRow.church_id){
                this.selectedChurchName=this.churchesData[i].church_name;
              }
            }
            console.log("rowss church name", this.selectedChurchName);
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
            this.churchesData = res.data;
            console.log("church data",this.churchesData);
           
          }
        }
      },
      (error: any) => {}
    );
  }
  checkOther(event: any) {
    console.log("event item", event.target.innerText);

    if (!this.selectMultiGroupSelected.includes(event.target.innerText)) {
      if (event.target.innerText !== "") {
        this.selectMultiGroupSelected.push(event.target.innerText);
       
      }
    } else {
      let idx = this.selectMultiGroupSelected.indexOf(event.target.innerText);
      this.selectMultiGroupSelected.splice(idx, 1);
     
    }
    this.checkFormModified();
    console.log("item", this.selectMultiGroupSelected);
   
  }
  replaceNullsWithEmptyStrings(obj: any): any {
    const updatedObj: any = {};
  
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        updatedObj[key] = value === null ? '' : value;
      }
    }
  
    return updatedObj;
  }
  checkFormModified() {
    console.log("current row",this.currentRow);
    console.log("original form row",this.originalFormValues);

    this.formModified = !isEqual(this.currentRow, this.originalFormValues);
    console.log("this.modified",this.formModified);
  }

}
