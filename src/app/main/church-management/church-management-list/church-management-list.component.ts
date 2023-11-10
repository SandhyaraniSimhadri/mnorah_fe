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
// import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
// UserListService

@Component({
  selector: "app-church-management-list",
  templateUrl: "./church-management-list.component.html",
  styleUrls: ["./church-management-list.component.scss"],
 
})
export class ChurchManagementListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
  public apiUrl: any;
  public selectChurch: any = [];
  public selectUsers: any = [];
  public selectLanguage: any = [];
  public loading: boolean = false;
  public searchValue = "";
  public selectedChurch = [];
  public selectedUsers = [];
  public selectedLanguage = [];
  public buttonLoading:any=false

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
    // Reset ng-select on search
    this.selectedChurch = this.selectChurch[0];
    this.selectedUsers = this.selectUsers[0];
    this.selectedLanguage = this.selectLanguage[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.church_name.toLowerCase().indexOf(val) !== -1 || !val;
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
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousPlanFilter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByUsers(event) {
    const filter = event ? event.value : "";
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(
      this.previousRoleFilter,
      filter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByLanguage(event) {
    const filter = event ? event.value : "";
    this.previousStatusFilter = filter;
    console.log("prev", this.previousStatusFilter);
    this.temp = this.filterRows(
      this.previousRoleFilter,
      this.previousPlanFilter,
      filter
    );
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param churchFilter
   * @param usersFilter
   * @param languageFilter
   */
  filterRows(churchFilter, usersFilter, languageFilter): any[] {
    // Reset search on select change
    this.searchValue = "";
    console.log("churchFilter", churchFilter);
    console.log("usersFilter", usersFilter);
    console.log("languageFilter", languageFilter);

    churchFilter = churchFilter.toLowerCase();
    usersFilter = usersFilter.toLowerCase();
    languageFilter = languageFilter.toLowerCase();
    console.log("tempdata", this.tempData);
    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.church_name.toLowerCase().indexOf(churchFilter) !== -1 ||
        !churchFilter;
      const isPartialUsersMatch =
        row.users.toLowerCase().indexOf(usersFilter) !== -1 || !usersFilter;
      const isPartialLanguageMatch =
        row.language.toLowerCase().indexOf(languageFilter) !== -1 ||
        !languageFilter;
      return (
        isPartialNameMatch && isPartialUsersMatch && isPartialLanguageMatch
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
    this.getChurches();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getChurches() {
    this.loading = true;
    let request;

    request = {
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
            this.rows = res.data;
            this.tempData = this.rows;
            console.log("rowss", this.rows);
            const nameSet = new Set();
            this.rows.forEach((church) => {
              if (!nameSet.has(church.church_name)) {
                this.selectChurch.push({
                  name: church.church_name,
                  value: church.church_name,
                });
                nameSet.add(church.church_name);
              }
            });
            const usersSet = new Set();
            this.rows.forEach((church) => {
              if (!usersSet.has(church.users)) {
                this.selectUsers.push({
                  name: church.users,
                  value: church.users,
                });
                usersSet.add(church.users);
              }
            });
            const languageSet = new Set();
            this.rows.forEach((church) => {
              if (!languageSet.has(church.language)) {
                this.selectLanguage.push({
                  name: church.language,
                  value: church.language,
                });
                languageSet.add(church.language);
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
    console.log("called");
    this.loading=true;
    this.rows.push(newUser);
    this.getChurches(); 
  }
  delete(id: any) {
    this.buttonLoading=true;
    let request = {
      params: { id: id },
      action_url: "delete_church",
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
            this.getChurches();
          }
        }
    this.buttonLoading=false;
      },
      (error: any) => {
    this.buttonLoading=false;

      }
    );
  }
}
