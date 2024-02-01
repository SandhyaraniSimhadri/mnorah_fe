import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { A } from "@fullcalendar/core/internal-common";
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
  public role: any;
  public modulesData:any=[{module_pid:1,module_name:'Member',read:false,update:false,create:false,delete:false},{module_pid:2,module_name:'Feed',read:false,update:false,create:false,delete:false},{module_pid:3,module_name:'Event',read:false,update:false,create:false,delete:false},
{module_pid:4,module_name:'Visitor',read:false,update:false,create:false,delete:false},{module_pid:5,module_name:'Testimony',read:false,update:false,create:false,delete:false},{module_pid:6,module_name:'Life group',read:false,update:false,create:false,delete:false},{module_pid:7,module_name:'Prayer request',read:false,update:false,create:false,delete:false}];

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
    this.church_id = this.httpService.USERINFO.church_id;}
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
    // const formData = new FormData();
    // formData.append("church_id", this.church_id);
    // formData.append("role", this.role);
    // formData.append("role_permissions",JSON.stringify(this.modulesData));
  
    if (form.valid) {
      let request = {
        params: { church_id: this.church_id, role:this.role, role_permissions:JSON.stringify(this.modulesData) },
        action_url: "add_role_permissions",
        method: "POST",
      };
  
      this.httpService.doHttp(request).subscribe(
     
        (res: any) => {

          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else if (res.status == true) {
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
    this.getModules();
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
  getModules() {
    let request = {
      params: null,
      action_url: "get_modules",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            // this.modulesData = res.data;
            // var i=0;
            // for(i=0;i<this.modulesData.length;i++){
            //   if(this.modulesData[i].read==null){
            //     this.modulesData[i].read=0;
            //   }
            //   if(this.modulesData[i].update==null){
            //     this.modulesData[i].update=0;
            //   }
            //   if(this.modulesData[i].create==null){
            //     this.modulesData[i].create=0;
            //   }
            //   if(this.modulesData[i].delete==null){
            //     this.modulesData[i].delete=0;
            //   }
            
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
    this.role = "";
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
          }
        }
      },
      (error: any) => {}
    );
  }
  onCheckboxChange(type:any,index:any) {
    // debugger;

    if(type=='read'){
   
      this.modulesData[index].read=!this.modulesData[index].read;

    }else  if(type=='update'){
      this.modulesData[index].update=!this.modulesData[index].update;
    } else if(type=='create'){
      this.modulesData[index].create=!this.modulesData[index].create;
    }
    else{
      this.modulesData[index].delete=!this.modulesData[index].delete;
    }
  }
}
