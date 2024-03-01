import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

interface VisitorForm4 {
  visitingWithSpouse: string;
  selectedCount: {
    adults: number;
    children: number;
    infants: number;
    seniors: number;
  };
}

@Component({
  selector: "app-visitor-management-new",
  templateUrl: "./visitor-management-new.component.html",
  styleUrls: ["./visitor-management-new.component.scss"],
  encapsulation: ViewEncapsulation.None,
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
  public loading: boolean = false;
  public customTagNames = ["Uber", "Microsoft", "Flexigen"];
  public selectMulti = [
    { name: "I am a first-time visitor" },
    { name: "I am interested in joining a small group" },
    { name: "I would like to receive updates and newsletters via email" },
    { name: "I am interested in volunteering" },
  ];
  public customTagSelected: any = [];
  public selectMultiGroupSelected = [];
  public selectMultiSelected = [];
  public coreSpinValue: number = 7;
  public firstDiv: any = true;
  public secondDiv: any = false;
  public thirdDiv: any = false;
  public fourthDiv: any = false;
  public fifthDiv: any = false;
  public errorMsg: any = false;
  public errorMsg1: any = false;
  public errorMsg2: any = false;

  public visitorForm1: {
    first_name: string;
    email: string;
    phone_number: string;
  } = {
    first_name: "",
    email: "",
    phone_number: "",
  };

  public visitorForm2: {
    hear_about: string;
    hear_about_other: string;
  } = {
    hear_about: "",
    hear_about_other: "",
  };
  public visitorForm3: { visiting_with: string } = {
    visiting_with: "",
  };
  public visitorForm4: VisitorForm4 = {
    visitingWithSpouse: "",
    selectedCount: {
      adults: 0,
      children: 0,
      infants: 0,
      seniors: 0,
    },
  };

  public visitorForm5: any = {
    prayer_request: "",
  };

  public visitorForm: any = {
    first_name: "",
    last_name: "",
    spouse_name: "",
    child1_name: "",
    child2_name: "",
    child3_name: "",
    child4_name: "",
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
    about_visit: "",
    suggestions: "",
    prayer_request: "",
    comments: "",
    connection: "",
    visiting_with: "",
  };
  selectedChurchName: any = "";
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
  // @ViewChild("newUserForm") newUserForm: NgForm;
  // @ViewChild("newUserForm1") newUserForm1: NgForm;
  // @ViewChild("newUserForm2") newUserForm2: NgForm;
  // @ViewChild("newUserForm3") newUserForm3: NgForm;
  // @ViewChild("newUserForm4") newUserForm4: NgForm;

  // public customTag: any[] = [{name: 'Uber'}, {name: 'Microsoft'}, {name: 'Flexigen'}];
  // public cars = [{id: '1', name: 'BMW'}, {id: '2', name: 'Benz'}, {id: '3', name: 'Ferrari'}];
  // public selectedCar: any = [];
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _http: HttpClient,
    private _coreConfigService: CoreConfigService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    if (this.httpService.USERINFO.role == "Sub Admin") {
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

  countChange(type: string, val: number) {
    this.errorMsg2 = false;
    this.visitorForm4.selectedCount[type] = val;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this.secondDiv = false;
    this.firstDiv = true;
  }
  getData() {
    this._http
      .get<any>(environment.apiUrl + "api/get_churches_for_visitor")
      .subscribe(
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
              this.status = true;
            }
          }
        },
        (error: any) => {
          // Handle error if needed
        }
      );
  }
  /**
   * Submit
   *
   * @param form
   */
  submit(form: any) {
    if (this.selectMultiGroupSelected.length > 0) {
      this.visitorForm.connection = this.selectMultiGroupSelected.toString();
    }
    if (form.valid) {
      this.loading = true;
      const request = {
        params: this.visitorForm,
        action_url: "add_visitor",
      };

      this._http
        .post<any>(environment.apiUrl + "api/add_visitor", this.visitorForm)
        .subscribe(
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
                this.visitorForm = {
                  first_name: "",
                  last_name: "",
                  spouse_name: "",
                  child1_name: "",
                  child2_name: "",
                  child3_name: "",
                  child4_name: "",
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
                  about_visit: "",
                  suggestions: "",
                  prayer_request: "",
                  comments: "",
                  connection: "",
                };
              }
            }
            this.loading = false;
          },
          (error: any) => {
            this._toastrService.error("Fill all the details", "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.loading = false;
          }
        );
    }
  }

  ngOnInit(): void {
    this.checkOrientation();
    this.getData();
    this.customTagNames.forEach((c, i) => {
      this.customTag.push({ id: i, name: c });
    });
  }

  checkOrientation() {
    window.onload = function () {
      var desktopOnlyDiv = document.getElementById("desktop-only");
      var mobileOnlyDiv = document.getElementById("mobile-only");

      if (
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1
      ) {
        mobileOnlyDiv.style.display = "block";
      } else {
        desktopOnlyDiv.style.display = "block";
      }
    };
  }

  churchName(event) {
    this.selectedChurchName = event.church_name;
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
  next() {
    this.secondDiv = true;
    this.firstDiv = false;
  }
  prev() {
    this.secondDiv = false;
    this.firstDiv = true;
  }
  first(form: any) {
    console.log("visitor form", this.visitorForm1);
    this.loading = true;
    if (form.valid) {
      this.secondDiv = true;
      this.firstDiv = false;
    } else {
      this.secondDiv = false;
      this.firstDiv = true;
    }
    this.loading = false;
  }
  second(form: any) {
    console.log("visitor form 1,", this.visitorForm2);
    this.loading = true;
    if (this.visitorForm2.hear_about) {
      this.thirdDiv = true;
      this.secondDiv = false;
    } else {
      this.errorMsg = true;
      this.thirdDiv = false;
      this.secondDiv = true;
    }
    this.loading = false;
  }
  checkHearabout() {
    this.errorMsg = false;
  }
  checkSpouse() {
    this.errorMsg2 = false;
  }
  third(form: any) {
    console.log("visitor form 3,", this.visitorForm3);
    this.loading = true;
    if (this.visitorForm3.visiting_with) {
      if (this.visitorForm3.visiting_with == "With your family") {
        this.fourthDiv = true;
        this.thirdDiv = false;
      } else {
        this.fifthDiv = true;
        this.thirdDiv = false;
      }
    } else {
      this.errorMsg1 = true;
      this.fourthDiv = false;
      this.thirdDiv = true;
    }
    this.loading = false;
  }
  checkVisitingWith(value: any) {
    this.errorMsg1 = false;
  }
  fourth(form: any) {
    const familyVisitorsCount = Object.values(
      this.visitorForm4.selectedCount
    ).reduce((total, ob) => total + ob, 0);
    if (!!this.visitorForm4.visitingWithSpouse || familyVisitorsCount > 0) {
      this.fourthDiv = false;
      this.fifthDiv = true;
    } else {
      this.errorMsg2 = true;
      this.fourthDiv = true;
      this.fifthDiv = false;
    }
  }
  submitForm() {
    this.visitorForm = {
      first_name: this.visitorForm1.first_name,
      last_name: "",
      spouse_name: "",
      child1_name: "",
      child2_name: "",
      child3_name: "",
      child4_name: "",
      gender: "",
      email: this.visitorForm1.email,
      phone_number: this.visitorForm1.phone_number,
      address: "",
      city: "",
      church_id: "",
      hear_about: this.visitorForm2.hear_about,
      hear_about_other: "",
      visit_date: "",
      experience: "",
      about_visit: "",
      suggestions: "",
      prayer_request: this.visitorForm5.prayer_request,
      comments: "",
      connection: "",
      visiting_with: this.visitorForm3.visiting_with,
    };
    console.log("submit form", this.visitorForm);
    this.loading = true;
    const request = {
      params: this.visitorForm,
      action_url: "add_visitor",
    };

    this._http
      .post<any>(environment.apiUrl + "api/add_visitor", this.visitorForm)
      .subscribe(
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
              this.visitorForm1 = {
                first_name: "",
                email: "",
                phone_number: "",
              };

              this.visitorForm2 = {
                hear_about: "",
                hear_about_other: "",
              };
              this.visitorForm3 = {
                visiting_with: "",
              };
              this.visitorForm4 = {
                visitingWithSpouse: "",
                selectedCount: {
                  adults: 0,
                  children: 0,
                  infants: 0,
                  seniors: 0,
                },
              };

              this.visitorForm5 = {
                prayer_request: "",
              };

              this.visitorForm = {
                first_name: "",
                last_name: "",
                spouse_name: "",
                child1_name: "",
                child2_name: "",
                child3_name: "",
                child4_name: "",
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
                about_visit: "",
                suggestions: "",
                prayer_request: "",
                comments: "",
                connection: "",
              };
              this.fifthDiv = false;
              this.firstDiv = true;
            }
          }
          this.loading = false;
        },
        (error: any) => {
          this._toastrService.error("Fill all the details", "Failed", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
        }
      );
  }
}
