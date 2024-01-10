import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  @Output() onPrayerRequestAdded: EventEmitter<any> = new EventEmitter<any>();
  public church_id;
  public member_id: any;
  public form: any;
  public churchData: any;
  public membersData: any;
  public loading: boolean = false;
  public image: any;
  public apiUrl: any;
  public imageval: any;
  public prayer_request: any;
  public prayer_request_other: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService,
    private http: HttpClient
  ) {
    if(this.httpService.USERINFO.role=='Sub Admin'){
      console.log("service data",this.httpService.USERINFO);
    this.church_id = this.httpService.USERINFO.church_id;
  console.log("member id",this.church_id)}
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this.getData();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.loading = true;
    const formData = new FormData();
    formData.append("church_id", this.church_id);
    formData.append("member_id", this.member_id);
    formData.append("prayer_request", this.prayer_request);
    formData.append("prayer_request_other", this.prayer_request_other);
    if (form.valid) {
      console.log("form values", this.form);

      this.http.post<any>(this.apiUrl + "api/add_prayer_request", formData).subscribe(
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
              this.onPrayerRequestAdded.emit(res.data);

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
    this.loading=false;
  }

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getData();
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
            this.churchData = res.data;
            console.log("churches data", this.churchData);
          }
        }
      },
      (error: any) => {}
    );
  }
  uploadImage(event: any) {
    this.loading = true;
    this.image = event.target.files[0];
    this.loading = false;
  }
  getMembers() {
    this.membersData = [];
    this.member_id = "";
    this.prayer_request = "";
    this.prayer_request_other = "";
    console.log("@gb getdata called ");
    let request = {
      params: { church_id: this.church_id },
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
            console.log("churches data", this.churchData);
          }
        }
      },
      (error: any) => {}
    );
  }
}
