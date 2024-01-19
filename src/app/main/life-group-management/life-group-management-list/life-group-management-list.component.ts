import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { ModalsService } from "@core/services/modals.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: "app-life-group-management-list",
  templateUrl: "./life-group-management-list.component.html",
  styleUrls: ["./life-group-management-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LifeGroupManagementListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousCityFilter = "";
  public previousAreaFilter = "";
  public previousMembersFilter = "";
  public apiUrl: any;
  public selectCity: any = [];
  public selectArea: any = [];
  public selectMembers: any = [];
  public loading: boolean = false;
  public searchValue = "";
  public selectedCity = [];
  public selectedArea = [];
  public selectedMembers = [];

  public buttonLoading:any=false;
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
    private _coreSidebarService: CoreSidebarService,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    public modalsService:ModalsService,
    public modalService: NgbModal,
    private http: HttpClient

  ) {
    this._unsubscribeAll = new Subject();
    this.api_url = environment.apiUrl+'api/';
this.getMembers();
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
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    // this.selectedCity = this.selectCity[0];
    // this.selectedArea = this.selectArea[0];
    // this.selectedMembers = this.selectMembers[0];


    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      // return d.country.toLowerCase().match(val);
      // return d.church_name.toLowerCase().indexOf(val) !== -1 || !val;
      return d.country.toLowerCase().indexOf(val) !== -1 || !val;
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
  filterByCity(event) {
    const filter = event ? event.value : "";
    this.previousCityFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousAreaFilter,
      this.previousMembersFilter,

    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByArea(event) {
    const filter = event ? event.value : "";
    this.previousAreaFilter = filter;
    this.temp = this.filterRows(
      this.previousCityFilter,
      filter,
      this.previousMembersFilter,
    );
    this.rows = this.temp;
  }

  filterByMembers(event) {
    const filter = event ? event.value : "";
    this.previousMembersFilter = filter;
    this.temp = this.filterRows(
      this.previousCityFilter,
      this.previousAreaFilter,
      filter,

    );
    this.rows = this.temp;
  }

 /**
   * Filter Rows
   *
   * @param cityFilter
   * @param areaFilter
   * @param membersFilter
   */
  filterRows(cityFilter, areaFilter,membersFilter): any[] {
    // Reset search on select change
    this.searchValue = "";
    console.log("cityFilter", cityFilter);
    console.log("areaFilter", areaFilter);
    console.log("membersFilter", membersFilter);


    // cityFilter = cityFilter;
    // areaFilter = areaFilter;
    // membersFilter = membersFilter;

    console.log("tempdata", this.tempData);
    const filters = {
      city: cityFilter,
      area: areaFilter,
      members_count: membersFilter,
    };
    // return this.tempData.filter(row => {
    //   return Object.keys(filters).every(filter => {
    //     return filters[filter] = row[filter];
    //   });
    // });
    return this.tempData.filter((row) => {
      console.log("rows data",row);
      const isPartialCityMatch =
        row.city.toLowerCase().indexOf(cityFilter) !== -1 ||
        !cityFilter;
      const isPartialAreaMatch =
        row.area.toLowerCase().indexOf(areaFilter) !== -1 || !areaFilter;
        const isPartialMembersMatch =
        row.members_count.toString().indexOf(membersFilter) !== -1 || !membersFilter;
  
      return (
        isPartialCityMatch && isPartialAreaMatch && isPartialMembersMatch
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
    this.getLifeGroups();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getLifeGroups() {
    this.loading = true;
    let request;

    request = {
      params: null,
      action_url: "get_life_groups",
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
            const citySet = new Set();
            this.rows.forEach((lifegroup) => {
              if (!citySet.has(lifegroup.city)) {
                this.selectCity.push({
                  name: lifegroup.city,
                  value: lifegroup.city,
                });
                citySet.add(lifegroup.city);
              }
            });
            const areaSet = new Set();
            this.rows.forEach((lifegroup) => {
              if (!areaSet.has(lifegroup.area)) {
                this.selectArea.push({
                  name: lifegroup.area,
                  value: lifegroup.area,
                });
                areaSet.add(lifegroup.area);
              }
            });

            const membersSet = new Set();
            this.rows.forEach((lifegroup) => {
              if (!membersSet.has(lifegroup.members_count)) {
                this.selectMembers.push({
                  name: lifegroup.members_count,
                  value: lifegroup.members_count,
                });
                membersSet.add(lifegroup.members_count);
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
  updateLifeGroupList(newGroup: any) {
    console.log("called");
    this.loading=true;
    this.getLifeGroups(); 
  }
  delete(id: any) {
    this.buttonLoading=true;
    let request = {
      params: { id: id },
      action_url: "delete_life_group",
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
            this.getLifeGroups();
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

    this.http.post(this.apiUrl + "api/lifegroup_file_import", formData).subscribe(
      (res:any) => {
        if (res == "nonet") {
        }else{
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this._toastrService.success(res.msg+ ', '+res.count+ ' lifegroups added', "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.modalService.dismissAll();
            this.getLifeGroups();
          }}
      },
      (error) => {
        console.error('Error uploading file', error);
        // Handle error, e.g., show an error message
      }
    );
  }

}
