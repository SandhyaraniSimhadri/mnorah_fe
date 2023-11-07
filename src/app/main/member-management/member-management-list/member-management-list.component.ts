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
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousGenderFilter = '';
  public pending_users:any='';
  public active_users:any='';
  public loading:boolean=false;
  public apiUrl:any;


  public selectGender: any = [
    { name: 'Select', value: '' },
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
  ) {
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
    this.temp = this.filterRows( filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(genderFilter): any[] {
    // Reset search on select change
    this.searchValue = '';
    genderFilter = genderFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialGenderMatch = row.gender.toLowerCase().indexOf(genderFilter) !== -1 || !genderFilter;
      return isPartialGenderMatch;
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
            this.getMembers();
          }
        }
      },
      (error: any) => {}
    );
  }
}
