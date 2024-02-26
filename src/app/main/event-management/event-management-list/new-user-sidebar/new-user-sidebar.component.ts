import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreHttpService } from '@core/services/http.service';
import { environment } from 'environments/environment';
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
  public event_image: any;
  public imageval: any;
  public apiUrl: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, 
     public httpService: CoreHttpService,   private router: Router,private http: HttpClient,
     private _toastrService: ToastrService) {
      this.apiUrl = environment.apiUrl;
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
    const formData = new FormData();
    formData.append("event_image", this.event_image);
    formData.append("church_id", this.church_id);
    formData.append("event_name", this.event_name);
    formData.append("event_type", this.event_type);
    formData.append("event_date", this.event_date);
    formData.append("event_time", this.event_time);
    formData.append("venue", this.venue);
    formData.append("contact_person", this.contact_person);
    formData.append("frequency", this.frequency);
    formData.append("event_description", this.event_description);
    formData.append("agenda", this.agenda);
    formData.append("reg_info", this.reg_info);
    formData.append("speakers", this.speakers);
    formData.append("special_req", this.special_req);
    formData.append("dress_code", this.dress_code);
    formData.append("additional_info", this.additional_info);

    if (form.valid) {
      let request;

      request = {
        params: this.form,
        action_url: "add_event",
        method: "POST",
      };
      this.http.post<any>(this.apiUrl + "api/add_event", formData).subscribe(
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
  uploadImage(event: any) {
    this.loading = true;
    this.event_image = event.target.files[0];
    this.loading = false;
  }
}
