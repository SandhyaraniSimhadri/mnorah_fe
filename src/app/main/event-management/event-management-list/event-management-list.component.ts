import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { UserListService } from "./user-list.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { ModalsService } from "@core/services/modals.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
// UserListService
import { HttpClient } from '@angular/common/http';

@Component({
  selector: "app-event-management-list",
  templateUrl: "./event-management-list.component.html",
  styleUrls: ["./event-management-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
 
})
export class EventManagementListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousChurchFilter = "";
  public previousDateFilter = "";
  public previousStatusFilter = "";
  public apiUrl: any;
  public selectChurch: any = [];
  public selectDate: any = [];
  public selectLanguage: any = [];
  public loading: boolean = false;
  public searchValue = "";
  public selectedChurch = [];
  public selectedUsers = [];
  public selectedLanguage = [];
  public buttonLoading:any=false
  public file:any;
  public api_url: any;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    public modalsService:ModalsService,
    public modalService: NgbModal,
    private http: HttpClient

  ) {
    this._unsubscribeAll = new Subject();
    this.api_url = environment.apiUrl+'api/';

  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    // this.selectedChurch = this.selectChurch[0];
    // this.selectedUsers = this.selectDate[0];
    // this.selectedLanguage = this.selectLanguage[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.event_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByChurch(event) {
    const filter = event ? event.value : "";
    this.previousChurchFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousDateFilter,
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByDate(event) {
    const filter = event ? event.value : "";
    this.previousDateFilter = filter;
    this.temp = this.filterRows(
      this.previousChurchFilter,
      filter,
    );
    this.rows = this.temp;
  }


  /**
   * Filter Rows
   *
   * @param churchFilter
   * @param dateFilter
   * @param languageFilter
   */
  filterRows(churchFilter, dateFilter): any[] {
    // Reset search on select change
    this.searchValue = "";
    console.log("churchFilter", churchFilter);
    console.log("dateFilter", dateFilter);
   

    churchFilter = churchFilter.toLowerCase();
    dateFilter = dateFilter.toLowerCase();
    console.log("tempdata", this.tempData);
    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.church_name.toLowerCase().indexOf(churchFilter) !== -1 ||
        !churchFilter;
      const isPartialDateMatch =
        row.event_date.toLowerCase().indexOf(dateFilter) !== -1 || !dateFilter;
    
      return (
        isPartialNameMatch && isPartialDateMatch
      );
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getEvents();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getEvents() {
    this.loading = true;
    let request;

    request = {
      params: null,
      action_url: "get_events",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {

        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.rows = res.data;
            this.tempData = this.rows;
            console.log("rowss", this.rows);
            const nameSet = new Set();
            this.rows.forEach((event) => {
              if (!nameSet.has(event.church_name)) {
                this.selectChurch.push({
                  name: event.church_name,
                  value: event.church_name,
                });
                nameSet.add(event.church_name);
              }
            });
            const datesSet = new Set();
            this.rows.forEach((event) => {
              if (!datesSet.has(event.event_date)) {
                this.selectDate.push({
                  name: event.event_date,
                  value: event.event_date,
                });
                datesSet.add(event.date);
              }
            });
          }
        }
        console.log("datesss",this.selectDate);
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
      }
    );
  }
  updateEventList(newUser: any) {
    console.log("called");
    this.loading=true;
    this.rows.push(newUser);
    this.getEvents(); 
  }
  delete(id: any) {
    this.buttonLoading=true;
    let request = {
      params: { id: id },
      action_url: "delete_event",
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
            this._toastrService.success(res.msg, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getEvents();
          }
        }
    this.buttonLoading=false;
      },
      (error: any) => {
    this.buttonLoading=false;

      }
    );
  }
  modalOpenForm(modalForm) {
    this.modalService.open(modalForm);
  }
  uploadImage(event: any) {
    this.loading = true;
    this.file = event.target.files[0];
    this.loading = false;
    console.log("file",this.file);
  }
  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post(this.apiUrl + "api/event_file_import", formData).subscribe(
      (res:any) => {
        if (res == "nonet") {
        }else{
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this._toastrService.success(res.msg+ ', '+res.count+ ' events added', "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getEvents();
          }}
      },
      (error) => {
        console.error('Error uploading file', error);
        // Handle error, e.g., show an error message
      }
    );
  }
}
