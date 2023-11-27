import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
  encapsulation: ViewEncapsulation.None
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
  
  // public customTag: any[] = [{name: 'Uber'}, {name: 'Microsoft'}, {name: 'Flexigen'}];
  // public cars = [{id: '1', name: 'BMW'}, {id: '2', name: 'Benz'}, {id: '3', name: 'Ferrari'}];
  // public selectedCar: any = [];
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
  /**
   * Submit
   *
   * @param form
   */
  submit(form:any) {
    this.visitorForm.church_id=this.visitorForm.church_id.id;
    console.log("valuess",this.selectMultiGroupSelected);
    if(this.selectMultiGroupSelected.length>0){
      this.visitorForm.connection = this.selectMultiGroupSelected.toString();}
   console.log("selected invo final", this.visitorForm.connection );
    if (form.valid) {
      this.loading = true;
      console.log("form values", this.form);
      let request;

      request = {
        params: this.visitorForm,
        action_url: "add_visitor",
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
    console.log("valuesss",event);
    this.selectedChurchName=event.church_name;
  }
  selectAddTagMethod(name) {
    console.log('@gb dd:  ', name);
    return { name: name, tag: true };
  }
  checkOther(event: any) {
    console.log("event item", event.target.innerText);

    if (!this.selectMultiGroupSelected.includes(event.target.innerText)) {
      if (event.target.innerText !== "") {
        this.selectMultiGroupSelected.push(event.target.innerText);
       
      }
    } else {
      let idx = this.selectMultiGroupSelected.indexOf(event.target.innerText);
      this.selectMultiGroupSelected.splice(idx, 1);
     
    }
    console.log("item", this.selectMultiGroupSelected);
   
  }
}
