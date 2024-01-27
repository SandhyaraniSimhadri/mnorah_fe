import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreHttpService } from '@core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {
  @Output() onEventAdded: EventEmitter<any> = new EventEmitter<any>();
  // public fullname;
  // public username;
  // public email;
  public church_id;
  public event_name;
  public event_type;
  public event_date;
  public event_time;
  public venue;
  public contact_person;
  public frequency;
  public event_description;
  public agenda;
  public reg_info;
  public speakers;
  public special_req;
  public dress_code;
  public additional_info:any;
  public churchData:any;
  public loading:boolean=false;
  public form:any;


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, 
     public httpService: CoreHttpService,   private router: Router,
     private _toastrService: ToastrService) {
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
    this.loading=true;
    this.form={church_id:this.church_id,event_name:this.event_name,event_type:this.event_type,event_date:this.event_date,event_time:this.event_time,
      venue:this.venue,contact_person:this.contact_person,frequency:this.frequency,event_description:this.event_description,agenda:this.agenda,
      reg_info:this.reg_info,speakers:this.speakers,special_req:this.special_req,dress_code:this.dress_code,additional_info:this.additional_info};
    if (form.valid) {
      let request;

      request = {
        params: this.form,
        action_url: "add_event",
        method: "POST",
      };
      this.httpService.doHttp(request).subscribe(
        (res: any) => {
  
          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg,'Failed',       { toastClass: 'toast ngx-toastr', closeButton: true });
            } else if (res.status == true) {
              this.onEventAdded.emit(res.data);

              this._toastrService.success(
                res.msg,
                'Success',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
              this.toggleSidebar('new-user-sidebar');
          }
        }
        this.loading=false;
        },
        (error: any) => {
          this.loading=false;
        }
      );
    
    }
    else{
      this.loading=false;
    }
  }

  ngOnInit(): void {
    this.getData();
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
}
