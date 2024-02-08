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
  public role_id:any;
  public rolesData:any;
  public modulesData:any=[{module_pid:1,module_name:'Member',read:false,update:false,create:false,delete:false},{module_pid:2,module_name:'Feed',read:false,update:false,create:false,delete:false},{module_pid:3,module_name:'Event',read:false,update:false,create:false,delete:false},
  {module_pid:4,module_name:'Visitor',read:false,update:false,create:false,delete:false},{module_pid:5,module_name:'Testimony',read:false,update:false,create:false,delete:false},{module_pid:6,module_name:'Life group',read:false,update:false,create:false,delete:false},{module_pid:7,module_name:'Prayer request',read:false,update:false,create:false,delete:false}];
  public role: any;
  

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
    let role=0;
   if(this.role_id=='Other'){
    role=0;
   }
   else{
    role=this.role_id
   }
    this.form = {
      full_name: this.fullname,
      gender: this.gender,
      dob: this.dob,
      email: this.email,
      phone_number: this.phone_number,
      city: this.city,
      church_id:this.church_id,
      role_id:role,
      role:this.role, role_permissions:JSON.stringify(this.modulesData)

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
    this.getRoles();
  }
  getRoles(){
    this.loading=true;
    let request;
    request = {
      params: null,
      action_url: "get_roles",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.rolesData=res.data;
         
          }
        }
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
      }
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
