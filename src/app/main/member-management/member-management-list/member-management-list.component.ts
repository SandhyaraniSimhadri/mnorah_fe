import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { UserListService } from './user-list.service';
import { CoreHttpService } from '@core/services/http.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ModalsService } from '@core/services/modals.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-member-management-list',
  templateUrl: './member-management-list.component.html',
  styleUrls: ['./member-management-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberManagementListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows=[];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousChurchFilter = '';
  public previousGenderFilter = '';
  public pending_users:any='';
  public active_users:any='';
  public loading:boolean=false;
  public apiUrl:any;
  public selectChurch: any = [];
  api_url:any;

  


  public selectGender: any = [
    { name: 'Female', value: 'Female' },
    { name: 'Male', value: 'Male' },
    { name: 'Others', value: 'Others' }
  ];


  public selectedGender = [];
  public searchValue = '';

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
    public httpService: CoreHttpService,   private router: Router,
    private _toastrService: ToastrService,
    public modalsService:ModalsService,
    public modalService: NgbModal,
    private http: HttpClient
  ) {
    this.api_url=environment.apiUrl;
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {

    this.selectedGender = this.selectGender[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
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
  // filterByRole(event) {
  //   const filter = event ? event.value : '';
  //   this.previousRoleFilter = filter;
  //   this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
  //   this.rows = this.temp;
  // }

  /**
   * Filter By Plan
   *
   * @param event
  //  */
  // filterByPlan(event) {
  //   const filter = event ? event.value : '';
  //   this.previousPlanFilter = filter;
  //   this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
  //   this.rows = this.temp;
  // }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByGender(event) {
    const filter = event ? event.value : '';
    this.previousGenderFilter = filter;
    this.temp = this.filterRows( filter,this.previousChurchFilter);
    this.rows = this.temp;
  }
  filterByChurch(event) {
    const filter = event ? event.value : "";
    this.previousChurchFilter = filter;
    this.temp = this.filterRows(
      this.previousGenderFilter,
      filter
    );
    this.rows = this.temp;
  }
  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(genderFilter,churchFilter): any[] {
    // Reset search on select change
    this.searchValue = '';
    genderFilter = genderFilter.toLowerCase();
    churchFilter = churchFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isFullGenderMatch = row.gender.toLowerCase() === genderFilter.toLowerCase() || !genderFilter;

      const isPartialNameMatch =
      row.church_name.toLowerCase().indexOf(churchFilter) !== -1 ||
      !churchFilter;
      return (
        isFullGenderMatch && isPartialNameMatch
      );
    }
    
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl=environment.apiUrl;
    this.getMembers();  
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  getMembers(){
    console.log("loading",this.loading);
    this.loading=true;
    let request;
    request = {
      params: null,
      action_url: "get_members",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.rows=res.data;
            this.tempData=this.rows;
            this.pending_users=res.pending_users;
            this.active_users=res.active_users;
            const nameSet = new Set();
            this.rows.forEach((feed) => {
              if (!nameSet.has(feed.church_name)) {
                this.selectChurch.push({
                  name: feed.church_name,
                  value: feed.church_name,
                });
                nameSet.add(feed.church_name);
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

  updateUserList(newUser: any) {
    this.loading=true;
    this.getMembers();
  }
  delete(id: any) {
    let request = {
      params: { id: id },
      action_url: "delete_member",
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
            this.getMembers();
          }
        }
      },
      (error: any) => {}
    );
  }
  generateDownloadLink() {
    console.log("link");

    const jwtToken = this.httpService.APIToken
    const downloadUrl = `${this.api_url}api/get_members_report?type=csv&jwt_token=${jwtToken}`;

    this.http.post(downloadUrl, { rows: this.rows }, { responseType: 'blob' as 'json' })
    .subscribe((blob: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reports.csv';
      link.click();
    });
  }
}
