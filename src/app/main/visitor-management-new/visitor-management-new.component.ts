import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
    selector: "app-visitor-management-new",
    templateUrl: "./visitor-management-new.component.html",
    styleUrls: ["./visitor-management-new.component.scss"],
  })
export class VisitorManagementNewComponent implements OnInit {
  @Output() onUserAdded: EventEmitter<any> = new EventEmitter<any>();
  public fullname;
  public gender;
  public dob;
  public email;
  public phone_number;
  public city;
  public form: any;
  public state;
  public rows: any;
  public churcesData: any;
  public status: any = false;
  public enableVolunteering: any = false;
  public enableAttending: any = false;
  public loading:boolean=false;
  public customTagNames = ['Uber', 'Microsoft', 'Flexigen'];
  public selectMulti=[{name:'I am a first-time visitor'}, {name:'I am interested in joining a small group'} ,{name:'I would like to receive updates and newsletters via email'} ,{name:'I am interested in volunteering'} ];  
  public customTagSelected: any = [];
  public selectMultiGroupSelected = [];
  public selectMultiSelected = [];
  public firstDiv:any=true;
  public secondDiv:any=false;

  public visitorForm: any = {
    first_name: "",
    last_name:"",
    spouse_name:"",
    child1_name:"",
    child2_name:"",
    child3_name:"",
    child4_name:"",
    gender: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    church_id: "",
    hear_about: "",
    hear_about_other: "",
    visit_date: "",
    experience: "",
    about_visit:"",
    suggestions:"",
    prayer_request:"",
    comments:"",
    connection:""
  };
  selectedChurchName:any='';
  public customTag: any[] = [];
  public selectGroup = [
    {
      name: " I am a first-time visitor.",
      group: "Connection Card",
    },
    {
      name: "I am interested in joining a small group",
      group: "Connection Card",
    },
    {
      name: "I would like to receive updates and newsletters via email.",
      group: "Connection Card",
    },
    {
      name: "I am interested in volunteering.",
      group: "Connection Card",
    },
   

  ];
  @ViewChild("newUserForm") newUserForm: NgForm;
  
  // public customTag: any[] = [{name: 'Uber'}, {name: 'Microsoft'}, {name: 'Flexigen'}];
  // public cars = [{id: '1', name: 'BMW'}, {id: '2', name: 'Benz'}, {id: '3', name: 'Ferrari'}];
  // public selectedCar: any = [];
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _http: HttpClient,
    private _coreConfigService: CoreConfigService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    if(this.httpService.USERINFO.role=='Sub Admin'){
    this.visitorForm.church_id = this.httpService.USERINFO.church_id;
}
this._coreConfigService.config = {
  layout: {
    navbar: {
      hidden: true,
    },
    menu: {
      hidden: true,
    },
    footer: {
      hidden: true,
    },
    customizer: false,
    enableLocalStorage: false,
  },
};
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this.secondDiv=false;
    this.firstDiv=true;
 
  }
  getData() {
    this._http.get<any>(environment.apiUrl+'api/get_churches_for_visitor').subscribe(
      (res: any) => {
        if (res === "nonet") {
          return [];
          // Handle 'nonet' response if needed
        } else {
          if (res.status === false) {
            return [];
            // Handle false status if needed
          } else if (res.status === true) {
            this.churcesData = res.data;
           this.status=true;
          }
        }
      },
      (error: any) => {
        // Handle error if needed
      });
  }
  /**
   * Submit
   *
   * @param form
   */
  submit(form:any) {
    if (this.selectMultiGroupSelected.length > 0) {
      this.visitorForm.connection = this.selectMultiGroupSelected.toString();
    }
    if (form.valid) {
      this.loading = true;
      const request = {
        params: this.visitorForm,
        action_url: "add_visitor"
      };
  
      this._http.post<any>(environment.apiUrl+'/api/add_visitor', request).subscribe(
        (res: any) => {
          if (res === "nonet") {
            // Handle 'nonet' response if needed
          } else {
            if (res.status === false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else if (res.status === true) {
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
          this._toastrService.error('Fill all the details', "Failed", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
        }
      );
    }
  }
  ngOnInit(): void {
    this.getData();
    this.customTagNames.forEach((c, i) => {
      this.customTag.push({ id: i, name: c });
    });
  }
 
  churchName(event){
    this.selectedChurchName=event.church_name;
  }
  selectAddTagMethod(name) {
    return { name: name, tag: true };
  }
  checkOther(event: any) {

    if (!this.selectMultiGroupSelected.includes(event.target.innerText)) {
      if (event.target.innerText !== "") {
        this.selectMultiGroupSelected.push(event.target.innerText);
       
      }
    } else {
      let idx = this.selectMultiGroupSelected.indexOf(event.target.innerText);
      this.selectMultiGroupSelected.splice(idx, 1);
     
    }
   
  }
  next(){
    this.secondDiv=true;
    this.firstDiv=false;
  }
  prev(){
    this.secondDiv=false;
    this.firstDiv=true;
  }
}
