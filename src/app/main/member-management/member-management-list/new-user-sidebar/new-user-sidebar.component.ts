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
  public selectGroupselected: any[] = [];
  public enableVolunteering: any = false;
  public enableAttending: any = false;
  public loading:boolean=false;
  public selectGroup = [
    // {
    //   name: "I am interested in becoming a member.",
    //   country: "I am interested in becoming a member.",
    // },
    {
      name: "Ushering",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Children's Ministry",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Music Ministry",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Sunday School",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Other (please specify)",
      country: "I am interested in volunteering in the following areas:",
    },
    {
      name: "Sunday Service",
      country: "I am interested in attending the following events:",
    },
    {
      name: "Bible Study",
      country: "I am interested in attending the following events:",
    },

    {
      name: "Fellowship Events",
      country: "I am interested in attending the following events:",
    },
    {
      name: "Community Outreach",
      country: "I am interested in attending the following events:",
    },
    {
      name: "Other (please specify):",
      country: "I am interested in attending the following events:",
    },
  ];
  public selectMultiGroupSelected = [];
  public memberForm: any = {
    fullname: "",
    gender: "",
    dob: "",
    email: "",
    phone_number: "",
    city: "",
    state: "",
    membership: "",
    church_id: "",
    membership_others: "",
    hear_about_church: "",
    hear_about_church_other: "",
    volunteering_other: "",
    attending_other: "",
    comments:""
  };

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
  ) {
    if(this.httpService.USERINFO.role=='Sub Admin'){
    this.memberForm.church_id = this.httpService.USERINFO.church_id;
}
  }

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
 if(this.selectMultiGroupSelected.length>0){
    this.memberForm.invovlement = this.selectMultiGroupSelected.toString();}

    if (form.valid) {
      this.loading = true;
      let request;

      request = {
        params: this.memberForm,
        action_url: "add_member",
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
  }
  checkOther(event: any) {

    if (!this.selectMultiGroupSelected.includes(event.target.innerText)) {
      if (event.target.innerText !== "") {
        this.selectMultiGroupSelected.push(event.target.innerText);
        if (event.target.innerText == "Other (please specify)") {
          this.enableVolunteering = true;
        }
        if (event.target.innerText == "Other (please specify):") {
          this.enableAttending = true;
        }
      }
    } else {
      let idx = this.selectMultiGroupSelected.indexOf(event.target.innerText);
      this.selectMultiGroupSelected.splice(idx, 1);
      if (event.target.innerText == "Other (please specify)") {
        this.enableVolunteering = false;
      }
      if (event.target.innerText == "Other (please specify):") {
        this.enableAttending = false;
      }
    }
  }
}
