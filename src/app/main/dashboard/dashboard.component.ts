import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CoreHttpService } from '@core/services/http.service';

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";

import { CoreTranslationService } from "@core/services/translation.service";

import { locale as german } from "app/main/tables/datatables/i18n/de";
import { locale as english } from "app/main/tables/datatables/i18n/en";
import { locale as french } from "app/main/tables/datatables/i18n/fr";
import { locale as portuguese } from "app/main/tables/datatables/i18n/pt";

import * as snippet from "app/main/tables/datatables/datatables.snippetcode";

import { DatatablesService } from "app/main/tables/datatables/datatables.service";

import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
 
})
export class DashboardComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public editingName = {};
  public editingStatus = {};
  public editingAge = {};
  public editingSalary = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public dashboardData:any=[];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;

  // snippet code variables


  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Inline editing Name
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateName(event, cell, rowIndex) {
    this.editingName[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Inline editing Age
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateAge(event, cell, rowIndex) {
    this.editingAge[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Inline editing Salary
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateSalary(event, cell, rowIndex) {
    this.editingSalary[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Inline editing Status
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateStatus(event, cell, rowIndex) {
    this.editingStatus[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Row Details Toggle
   *
   * @param row
   */
  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  /**
   * For ref only, log activate events
   *
   * @param selected
   */
  onActivate(event) {
    // console.log('Activate Event', event);
  }

  /**
   * Custom Chkbox On Select
   *
   * @param { selected }
   */
  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }

  /**
   * Constructor
   *
   * @param {DatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(
    private _datatablesService: DatatablesService,
    private _coreTranslationService: CoreTranslationService,
    private http: HttpClient,
    public httpService: CoreHttpService,
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, french, german, portuguese);
    // this.kitchenSinkRows = [
    //   {
    //     full_name: 'John Doe',
    //     status: '1',
    //     post: 'Manager',
    //     email: 'john@example.com',
    //     phone: '123-456-7890',
    //     position: 'Forward',
    //     location: 'New York',
    //     'matches-played': 20,
    //     'season-points': 45,
    //     'season-rank': 3,
    //     'turf-gems': 15,
    //   },
    //   {
    //     full_name: 'Jane Smith',
    //     status: '2',
    //     post: 'Coach',
    //     email: 'jane@example.com',
    //     phone: '987-654-3210',
    //     position: 'Midfielder',
    //     location: 'Los Angeles',
    //     'matches-played': 15,
    //     'season-points': 60,
    //     'season-rank': 1,
    //     'turf-gems': 25,
    //   },
    //   {
    //     full_name: 'Bob Johnson',
    //     status: '3',
    //     post: 'Goalkeeper',
    //     email: 'bob@example.com',
    //     phone: '555-123-4567',
    //     position: 'Goalkeeper',
    //     location: 'Chicago',
    //     'matches-played': 10,
    //     'season-points': 30,
    //     'season-rank': 5,
    //     'turf-gems': 10,
    //   },
    // ];
    
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._datatablesService.onDatatablessChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.rows = response;
        this.tempData = this.rows;
       
      });

    // content header
    this.contentHeader = {
      headerTitle: "Datatables",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Forms & Tables",
            isLink: true,
            link: "/",
          },
          {
            name: "Datatables",
            isLink: false,
          },
        ],
      },
    };
    this.playerInfo();
  }
  calculateSeasonPoints(matchesPlayed: number): number {
    return matchesPlayed * 10;
  }
  playerInfo(){
    let request = {
      params: null,
      action_url: "get_dashboard_details",
      method: "GET",
    };

    // this.httpService.showLoader();
    console.log("request", request);
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        console.log("res", res);
        // this.httpService.hideLoader();
        console.log(res);
        if (res == "nonet") {
          // this.error = error;
          // this.loading = false;
        } else {
          if (res.status == false) {
            // this.error = error;
            // this.loading = false;
          } else if (res.status == true) {
            if (res.data) {
              this.dashboardData=res.data;
              console.log("dashboard",this.dashboardData)
            }
          }
        }
      },
      (error: any) => {
      console.log("error",error);
      }
    );
  }

}
