import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  @Output() onUserAdded: EventEmitter<any> = new EventEmitter<any>();
  // public fullname;
  // public username;
  // public email;
  public admin_id;
  public church_name;
  public pastor_name;
  public location;
  public users;
  public denomination;
  public language;
  public city;
  public country;
  public church_address;
  public contact_number;
  public address;
  public website;
  public form: any;
  public adminsData: any;
  public loading: boolean = false;
  public customTag: any[] = [];
  public customTagselected: any = [];
  public admins_list: any;
  public status: boolean = false;

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
    this.getAdmins();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    console.log("selected values", this.customTagselected);
    var i = 0;
    if (Array.isArray(this.customTagselected)) {
      for (var i = 0; i < this.customTagselected.length; i++) {
        this.admins_list.push(this.customTagselected[i].id);
      }
    }

    this.loading = true;
    this.form = {
      admins_count: this.customTagselected.length,
      church_name: this.church_name,
      pastor_name: this.pastor_name,
      location: this.location,
      users: this.users,
      denomination: this.denomination,
      language: this.language,
      city: this.city,
      country: this.country,
      church_address: this.church_address,
      contact_number: this.contact_number,
      address: this.address,
      website: this.website,
      admins_list: this.admins_list,
    };
    if (form.valid) {
      console.log("form values", this.form);
      let request;

      request = {
        params: this.form,
        action_url: "add_church",
        method: "POST",
      };
      console.log("request", request);
      this.httpService.doHttp(request).subscribe(
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
              console.log("data", res.msg);
              this.onUserAdded.emit(res.data);

              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this.toggleSidebar("new-user-sidebar");
            }
          }
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  ngOnInit(): void {
    this.getAdmins();
  }
  getAdmins() {
    console.log("@gb getdata called ");
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
            console.log("customs data", this.customTag);
          }
        }
        this.status = true;
      },
      (error: any) => {}
    );
  }
}
