import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  @Output() onGroupAdded: EventEmitter<any> = new EventEmitter<any>();
  // public fullname;
  // public username;
  // public email;
  public church_id;
  public country;
  public city;
  public area;
  public members_count;
  public form: any;
  public churchData: any;
  public loading: boolean = false;
  public image: any;
  public apiUrl: any;
  public imageval: any;
  public members_list:any=[];
  public customTag: any[] = [];
  public customTagNames = ['Uber'];
  public SelectTag;
  public members_data:any;
  public customTagselected:any=[];


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    private http: HttpClient
  ) {
    if(this.httpService.USERINFO.role=='Sub Admin'){
    this.church_id = this.httpService.USERINFO.church_id;
}
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
    var i=0;
    if (Array.isArray(this.customTagselected)) {
      for (var i = 0; i < this.customTagselected.length; i++) {
        this.members_list.push(this.customTagselected[i].id);
      }
    }
    
    this.loading = true;
    const formData = new FormData();
    formData.append("church_id", this.church_id);
    formData.append("country", this.country);
    formData.append("city", this.city);
    formData.append("area", this.area);
    formData.append("members_count", this.customTagselected.length);
    formData.append("members",this.members_list);

    if (form.valid) {


      this.http.post<any>(this.apiUrl + "api/add_life_group", formData).subscribe(
        (res: any) => {

          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else if (res.status == true) {
              this.onGroupAdded.emit(res.data);

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
   

    this.apiUrl = environment.apiUrl;
    this.getData();
    this.getMembers();
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
  // uploadImage(event: any) {
  //   this.loading = true;
  //   this.image = event.target.files[0];
  //   this.loading = false;
  // }
}
