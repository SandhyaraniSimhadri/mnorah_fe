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
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-visitor-management-list',
  templateUrl: './visitor-management-list.component.html',
  styleUrls: ['./visitor-management-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VisitorManagementListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows=[];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousCityFilter = '';
  public pending_users:any='';
  public active_users:any='';
  public loading:boolean=false;
  public apiUrl:any;
  public file:any;
  public api_url: any;



  // public selectGender: any = [
  //   { name: 'Select', value: '' },
  //   { name: 'Female', value: 'Female' },
  //   { name: 'Male', value: 'Male' },
  //   { name: 'Others', value: 'Others' }
  // ];

public selectCity:any=[];
  public selectedCity = [];
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
    // this.selectedCity = this.selectCity[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
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
  filterByCity(event) {
    const filter = event ? event.value : '';
    this.previousCityFilter = filter;
    this.temp = this.filterRows( filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param cityFilter
   */
  filterRows(cityFilter): any[] {
    // Reset search on select change
    this.searchValue = '';
    cityFilter = cityFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialCityMatch = row.city.toLowerCase().indexOf(cityFilter) !== -1 || !cityFilter;
      return isPartialCityMatch;
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
    this.getVisitors();  
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  getVisitors(){
    this.loading=true;
    let request;
    request = {
      params: null,
      action_url: "get_visitors",
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
            const citySet = new Set();
            this.rows.forEach((visitor) => {
              if (!citySet.has(visitor.city)) {
                this.selectCity.push({
                  name: visitor.city,
                  value: visitor.city,
                });
                citySet.add(visitor.city);
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
    this.getVisitors();
  }
  delete(id: any) {
    let request = {
      params: { id: id },
      action_url: "delete_visitor",
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
            this.getVisitors();
          }
        }
      },
      (error: any) => {}
    );
  }
  modalOpenForm(modalForm) {
    this.modalService.open(modalForm);
  }
  uploadImage(event: any) {
    this.loading = true;
    this.file = event.target.files[0];
    this.loading = false;
  }
  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post(this.apiUrl + "api/visitor_file_import", formData).subscribe(
      (res:any) => {
        if (res == "nonet") {
        }else{
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this._toastrService.success(res.msg+ ', '+res.count+ ' visitors added', "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getVisitors();
          }}
      },
      (error) => {
        console.error('Error uploading file', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  generateDownloadLink() {

    const jwtToken = this.httpService.APIToken
    const downloadUrl = `${this.api_url}get_visitors_report?type=csv&jwt_token=${jwtToken}`;

    this.http.post(downloadUrl, { rows: this.rows }, { responseType: 'blob' as 'json' })
    .subscribe((blob: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reports.csv';
      link.click();
    });
  }
}
