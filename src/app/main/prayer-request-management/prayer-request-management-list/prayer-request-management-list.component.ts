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
  selector: "app-prayer-request-management-list",
  templateUrl: "./prayer-request-management-list.component.html",
  styleUrls: ["./prayer-request-management-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
 
})
export class PrayerRequestManagementListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousChurchFilter = "";
  public previousAuthorFilter = "";
  public previousStatusFilter = "";
  public apiUrl: any;
  public selectChurch: any = [];
  public selectAuthors: any = [];
  public loading: boolean = false;
  public searchValue = "";
  public selectedChurch = [];
  public selectedAuthors = [];
  public buttonLoading:any=false
  public file:any;
  public api_url: any;
  public members_data:any;

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
    // this.selectedAuthors = this.selectAuthors[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.prayer_request.toLowerCase().indexOf(val) !== -1 || !val;
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
      this.previousAuthorFilter,
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByAuthor(event) {
    const filter = event ? event.value : "";
    this.previousAuthorFilter = filter;
    this.temp = this.filterRows(
      this.previousChurchFilter,
      filter,

    );
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */


  /**
   * Filter Rows
   *
   * @param churchFilter
   * @param usersFilter
   * @param languageFilter
   */
  filterRows(churchFilter, authorFilter): any[] {
    // Reset search on select change
    this.searchValue = "";
    console.log("churchFilter", churchFilter);
    console.log("authorFilter", authorFilter);

    churchFilter = churchFilter.toLowerCase();
    authorFilter = authorFilter.toLowerCase();
    console.log("tempdata", this.tempData);
    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.church_name.toLowerCase().indexOf(churchFilter) !== -1 ||
        !churchFilter;
      const isPartialAuthorMatch =
        row.users.toLowerCase().indexOf(authorFilter) !== -1 || !authorFilter;
  
      return (
        isPartialNameMatch && isPartialAuthorMatch
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
    this.getMembers();
    this.getRequests();
  }
  getMembers(){
    console.log("loading",this.loading);
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
         
          }
        }
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
      }
    );
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getRequests() {
    this.loading = true;
    let request;

    request = {
      params: null,
      action_url: "get_prayer_requests",
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
            this.rows.forEach((request) => {
              if (!nameSet.has(request.church_name)) {
                this.selectChurch.push({
                  name: request.church_name,
                  value: request.church_name,
                });
                nameSet.add(request.church_name);
              }
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
  updateRequestList(newRequest: any) {
    console.log("called");
    this.loading=true;
    this.rows.push(newRequest);
    this.getRequests(); 
  }

  delete(id: any) {
    this.buttonLoading=true;
    let request = {
      params: { id: id },
      action_url: "delete_prayer_request",
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
            this.getRequests();
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

    this.http.post(this.apiUrl + "api/prayer_request_file_import", formData).subscribe(
      (res:any) => {
        if (res == "nonet") {
        }else{
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this._toastrService.success(res.msg+ ', '+res.count+ ' prayer requests added', "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getRequests();
          }}
      },
      (error) => {
        console.error('Error uploading file', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  generateDownloadLink() {
    console.log("link");

    const jwtToken = this.httpService.APIToken
    const downloadUrl = `${this.api_url}get_prayer_requests_report?type=csv&jwt_token=${jwtToken}`;

    this.http.post(downloadUrl, { rows: this.rows }, { responseType: 'blob' as 'json' })
    .subscribe((blob: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reports.csv';
      link.click();
    });
  }
}
