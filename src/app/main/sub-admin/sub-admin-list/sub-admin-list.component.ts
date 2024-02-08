import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalsService } from "@core/services/modals.service";

@Component({
  selector: "app-sub-admin-list",
  templateUrl: "./sub-admin-list.component.html",
  styleUrls: ["./sub-admin-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SubAdminListComponent implements OnInit {
  // Public
  public loading = false;
  public sidebarToggleRef = false;
  public rows = [];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousChurchFilter = "";
  public pending_users: any = "";
  public active_users: any = "";
  public totalrows:any;

  public apiUrl: any;



  public selectedChurch = [];
  
  public searchValue = "";
  public item:any;
  public selectChurch: any = [];
  public sentLoading:boolean=false;

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
  
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService,
    public modalService: NgbModal,
    public modalsService:ModalsService,

    
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

    // this.selectedChurch = this.selectChurch[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.user_name.toLowerCase().indexOf(val) !== -1 || !val;
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

   *
   * @param event
   */
  filterByChurch(event) {
    if (event == undefined) {
      this.temp = this.totalrows;
      this.rows = this.temp;
    }
    else{
    const filter = event ? event.value : "";
    this.previousChurchFilter = filter;
    this.temp = this.filterRows(filter);
    this.rows = this.temp;
    }
    
  }


  filterRows(churchFilter: string): any[] {
    // Reset search on select change
    this.searchValue = "";
    churchFilter = churchFilter.toLowerCase();

    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.church_name.toLowerCase().indexOf(churchFilter) !== -1 ||
        !churchFilter;
      return isPartialNameMatch;
    });
  }


  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getAdmins();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
getAdmins1() {
  this.rows = [];
  this.getAdmins();
}

updateUserList(newUser: any) {
  this.loading=true;
  this.getAdmins();

}
  getAdmins() {

    this.loading = true;
    let request;

    request = {
      params: null,
      action_url: "get_admins",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        this.loading = false;
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.rows = [...res.data];
            this.totalrows = res.data;
            this.tempData = this.rows;
            this.pending_users = res.pending_users;
            this.active_users = res.active_users;
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
          }
        }
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  delete(id: any) {
    let request = {
      params: { id: id },
      action_url: "delete_admin",
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
            this.getAdmins();
          }
        }
      },
      (error: any) => {}
    );
  }
  modalOpenDanger(modalDanger,item:any) {
    this.item=item;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: 'modal modal-danger'
    });
  }
  sendInvitation(item:any){
    this.sentLoading=true;
    let request = {
      params:  item,
      action_url: "send_sub_admin_invitation",
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
            this.getAdmins();
          }
        }
        this.sentLoading=false;
      },
      (error: any) => {
        this.sentLoading=false;
      }
    );
  }
}
  