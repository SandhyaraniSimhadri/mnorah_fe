import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { Subject } from "rxjs";
import { FlatpickrOptions } from "ng2-flatpickr";
import { cloneDeep } from "lodash";
import { CoreHttpService } from "@core/services/http.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { ModalsService } from "@core/services/modals.service";
import { isEqual } from 'lodash';

@Component({
  selector: "app-life-group-management-edit",
  templateUrl: "./life-group-management-edit.component.html",
  styleUrls: ["./life-group-management-edit.component.scss"],
  encapsulation: ViewEncapsulation.None
 
})
export class LifeGroupManagementEditComponent implements OnInit, OnDestroy {
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
  public churchData:any;
  public buttonLoading:boolean=false;
  public members_data:any;
  public customTag: any[] = [];
  public members_list:any=[];

  public originalFormValues: any;
  public formModified: boolean = false;
  @ViewChild("accountForm") accountForm: NgForm;
  public membersData: any;

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
  public customTagselected:any=[];
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
    private http: HttpClient,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    private _router: Router,
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
    this.loading=true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.loading=false;
    this.checkFormModified();

  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.buttonLoading=true;
    var i=0;
    if (Array.isArray(this.customTagselected)) {
      for (var i = 0; i < this.customTagselected.length; i++) {
        this.members_list.push(this.customTagselected[i].id);
      }
    }
    if (form.valid) {
      const formData = new FormData();
      formData.append("image", this.image);
      formData.append("id", this.currentRow.id);
      formData.append("church_id", this.currentRow.church_id);
      formData.append("country",this.currentRow.country);
      formData.append("city",this.currentRow.city);
      formData.append("area", this.currentRow.area);
      formData.append("members_count", this.customTagselected.length);
      formData.append("members",this.members_list);
      formData.append("leader",this.currentRow.leader);


      this.currentRow.image = this.image;
      this.http
        .post<any>(this.apiUrl+"api/update_life_group", formData)
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
                this._toastrService.success(
                  res.msg,
                  'Success',
                  { toastClass: 'toast ngx-toastr', closeButton: true }
                );
                this._router.navigate(["../life-group-management"]);
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
    this.getSingleLifeGroup();
    this.getMembers();
  }
  getMembers(){
    this.loading=true;
    let request;
    request = {
      params: null,
      action_url: "get_members_ids",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.members_data=res.data;
            // this.customTagNames.forEach((c, i) => {
            //   this.customTag.push({ id: i, name: c });
            // }); 
            this.members_data.forEach((c, i) => {
              this.customTag.push({ id: c.id ,name:c.user_name});
            });
          }
        }
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
      }
    );
  }
  getSingleLifeGroup() {
    this.loading=true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_life_group",
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

            if(this.currentRow.avatar){
            this.avatarImage = this.apiUrl+this.currentRow.avatar;}
            this.tempRow = cloneDeep(this.currentRow);
            this.currentRow.members=this.currentRow.members.split(',');
            console.log("members list all",this.currentRow.members);
            this.currentRow.members.forEach((c, i) => {
              this.customTagselected.push({ id: parseInt(c) ,name:this.currentRow.userNames[i]});
            });
            this.originalFormValues = { ...this.currentRow };
            this.selectedMembers = [...this.customTagselected];
            this.getChurchMembers(this.currentRow.church_id);
            
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
            this.churchData = res.data;
          }
        }
      },
      (error: any) => {}
    );
  }
  checkFormModified() {
     let formModified1=false;
     let formModified2 = false;
   formModified1 = !isEqual(this.currentRow, this.originalFormValues);
   console.log("modified values",this.customTagselected);
   console.log("original values",this.selectedMembers);

    formModified2 = !isEqual(this.customTagselected, this.selectedMembers);
    console.log("formmodified1",formModified1);
    console.log("formmodified2",formModified2);

    if(formModified1 || formModified2){
      this.formModified=true;
    }else{
      this.formModified=false;
    }

  }
  getChurchMembers(id) {
    this.membersData = [];

    let request = {
      params: { church_id: this.currentRow.church_id },
      action_url: "get_church_members",
      method: "POST",
    };

    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.membersData = res.data;
          }
          this.checkFormModified();
        }
      },
      (error: any) => {}
    );
  }

}
