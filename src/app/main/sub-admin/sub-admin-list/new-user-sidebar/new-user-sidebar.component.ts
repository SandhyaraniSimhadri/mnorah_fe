import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  @Output() onUserAdded: EventEmitter<any> = new EventEmitter<any>();
  public fullname;
  public gender;
  public dob;
  public email;
  public phone_number;
  public city;
  public form: any;
  public rows = [];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public tempData = [];
  public pending_users: any = "";
  public active_users: any = "";
  public loading: any = false;
  public churcesData: any;
  public status: any = false;
  public church_id:any;


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService
  ) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.loading = true;
   
    this.form = {
      full_name: this.fullname,
      gender: this.gender,
      dob: this.dob,
      email: this.email,
      phone_number: this.phone_number,
      city: this.city,
      church_id:this.church_id
    };
    if (form.valid) {
      this.loading = true;
      let request;

      request = {
        params: this.form,
        action_url: "add_subadmin",
        method: "POST",
      };
      this.httpService.doHttp(request).subscribe(
        (res: any) => {
          this.loading = false;
          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else if (res.status == true) {
               this.onUserAdded.emit(res.data);
              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });

              this.toggleSidebar("new-user-sidebar");
            }
          }
        },
        (error: any) => {
          this.loading = false;
        }
      );
    }else{
      this._toastrService.error('Fill all the details', "Failed", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      this.loading=false;
    }
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
            this.status = true;
          }
        }
      },
      (error: any) => {}
    );
  }
  ngOnInit(): void {
    this.getData();

  }

}
