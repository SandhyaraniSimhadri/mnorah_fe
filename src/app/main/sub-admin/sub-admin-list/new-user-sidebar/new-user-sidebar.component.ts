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
    };
    if (form.valid) {
      this.loading = true;
      console.log("form values", this.form);
      let request;

      request = {
        params: this.form,
        action_url: "add_subadmin",
        method: "POST",
      };
      console.log("request", request);
      this.httpService.doHttp(request).subscribe(
        (res: any) => {
          this.loading = false;
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
              console.log("data", res.msg);
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
  ngOnInit(): void {}

}
