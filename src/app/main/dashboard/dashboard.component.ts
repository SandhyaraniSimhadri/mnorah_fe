import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

import { first } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";

import { colors } from "app/colors.const";
import { User } from "app/auth/models";
import { UserService } from "app/auth/service";
import { CoreHttpService } from "@core/services/http.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  // Decorator
  @ViewChild("gainedChartRef") gainedChartRef: any;
  @ViewChild("orderChartRef") orderChartRef: any;
  @ViewChild("avgSessionChartRef") avgSessionChartRef: any;
  @ViewChild("supportChartRef") supportChartRef: any;
  @ViewChild("salesChartRef") salesChartRef: any;

  // Public
  public data: any;
  public currentUser: any;
  public loading: boolean = false;
  public users: User[] = [];
  public gainedChartoptions;
  public orderChartoptions;
  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;

  // Private
  private $primary = "#7367F0";
  private $warning = "#FF9F43";
  private $info = "#00cfe8";
  private $info_light = "#1edec5";
  private $strok_color = "#b9c3cd";
  private $label_color = "#e7eef7";
  private $white = "#fff";
  private $textHeadingColor = "#5e5873";
  public rows: any;
  public visitors: any;
  public prayer_requests: any;
  public testimony: any;
  public feeds: any;
  public life_group_members: any;
  public churches: any;
  public admins: any;

  /**
   * Constructor
   *
   * @param {UserService} _userService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   *
   */
  constructor(
    private _userService: UserService,
    private _coreConfigService: CoreConfigService,
    public httpService: CoreHttpService
  ) {
    // Subscribers Gained chart
    this.gainedChartoptions = {
      chart: {
        height: 100,
        type: "area",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: [this.$primary],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100],
        },
      },
      tooltip: {
        x: { show: false },
      },
    };

    // Order Received Chart
    this.orderChartoptions = {
      chart: {
        height: 100,
        type: "area",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: [this.$warning],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100],
        },
      },
      series: [
        {
          name: "Orders",
          data: [10, 15, 8, 15, 7, 12, 8],
        },
      ],
      tooltip: {
        x: { show: false },
      },
    };

    // Average Session Chart
    this.avgsessionChartoptions = {
      chart: {
        type: "bar",
        height: 200,
        sparkline: { enabled: true },
        toolbar: { show: false },
      },
      colors: [
        this.$label_color,
        this.$label_color,
        this.$primary,
        this.$label_color,
        this.$label_color,
        this.$label_color,
      ],
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          endingShape: "rounded",
        },
      },
      tooltip: {
        x: { show: false },
      },
    };

    // Support Tracker Chart
    this.supportChartoptions = {
      chart: {
        height: 290,
        type: "radialBar",
        sparkline: {
          enabled: false,
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "65%",
          },
          track: {
            background: this.$white,
            strokeWidth: "100%",
          },
          dataLabels: {
            name: {
              offsetY: -5,
              color: this.$textHeadingColor,
              fontSize: "1rem",
            },
            value: {
              offsetY: 15,
              color: this.$textHeadingColor,
              fontSize: "1.714rem",
            },
          },
        },
      },
      colors: [colors.solid.danger],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 8,
      },
      labels: ["Completed Tickets"],
    };

    // Sales Chart
    this.salesChartoptions = {
      chart: {
        height: 330,
        type: "radar",
        dropShadow: {
          enabled: true,
          blur: 8,
          left: 1,
          top: 1,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 0,
      },
      colors: [this.$primary, this.$info],
      plotOptions: {
        radar: {
          polygons: {
            connectorColors: "transparent",
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#9f8ed7", this.$info_light],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 0,
      },
      legend: {
        show: false,
      },
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      dataLabels: {
        style: {
          colors: [
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
          ],
        },
      },
      yaxis: {
        show: false,
      },
    };
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    /**
     * Get the secure api service (based on user role) (Admin Only secure API)
     * For example purpose
     */
    // this.loading = true;
    this.getMembers();
    // this.getVisitors();
    // this._userService
    //   .getAll()
    //   .pipe(first())
    //   .subscribe(users => {
    //     this.loading = false;
    //     this.users = users;
    //   });

    // Get the dashboard service data
  }

  /**
   * After View Init
   */
  getMembers() {
    console.log("loading", this.loading);
    this.loading = true;
    let request;
    console.log("rolee",this.httpService.USERINFO.role);
    if(this.httpService.USERINFO.role=='Super Admin'){
    request = {
      params: null,
      action_url: "get_superadmin_dashboard_data",
      method: "GET",
    };
  }
  if(this.httpService.USERINFO.role=='Sub Admin'){
    request = {
      params: null,
      action_url: "get_subadmin_dashboard_data",
      method: "GET",
    };
  }
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            console.log("resss", res);
            this.rows = res.members;
            this.rows.series = [
              { name: "members", data: this.rows.weekly_active_users },
            ];


            this.visitors = res.visitors;
            this.visitors.series = [
              { name: "visitors", data: this.visitors.weekly_visitors },
            ];


            this.prayer_requests = res.prayer_requests;
            this.prayer_requests.series = [
              { name: "prayer_requests", data: this.prayer_requests.weekly_prayer_requests },
            ];


            this.testimony = res.testimony;
            this.testimony.series = [
              { name: "testimony", data: this.testimony.weekly_testimony },
            ];


            this.feeds = res.feeds;
            this.feeds.series = [
              { name: "feeds", data: this.feeds.weekly_feeds },
            ];


            this.life_group_members = res.life_group_members;
            this.life_group_members.series = [
              { name: "life_group_members", data: this.life_group_members.weekly_life_group_members },
            ];
           
            if(this.httpService.USERINFO.role=='Super Admin'){
              
            this.churches = res.churches;
            this.churches.series = [
              { name: "churches", data: this.churches.weekly_churches },
            ];


            this.admins = res.admins;
            this.admins.series = [
              { name: "admins", data: this.admins.weekly_admins },
            ];}

          }
        }
        this.loading=false;
        console.log("loading value", this.loading);
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  getVisitors() {
    console.log("loading", this.loading);
    // this.loading=true;
    let request;
    request = {
      params: null,
      action_url: "get_dashboard_visitors",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            console.log("resss", res);
            this.visitors = res.visitor_data;
            console.log("rows", this.visitors);
            this.visitors.series = [
              { name: "visitors", data: this.visitors.weekly_visitors },
            ];
           
            this.feeds=res.feed_data;
            this.feeds.series = [
              { name: "feeds", data: this.feeds.weekly_feeds },
            ];
            console.log("rows data feeds", this.feeds);
          }
        }
        this.loading = false;
        console.log("loading value", this.loading);
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe((config) => {
      // If Menu Collapsed Changes
      if (
        config.layout.menu.collapsed === true ||
        config.layout.menu.collapsed === false
      ) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = false;
          this.gainedChartoptions.chart.width =
            this.gainedChartRef?.nativeElement.offsetWidth;
          this.orderChartoptions.chart.width =
            this.orderChartRef?.nativeElement.offsetWidth;
          this.avgsessionChartoptions.chart.width =
            this.avgSessionChartRef?.nativeElement.offsetWidth;
          this.supportChartoptions.chart.width =
            this.supportChartRef?.nativeElement.offsetWidth;
          this.salesChartoptions.chart.width =
            this.salesChartRef?.nativeElement.offsetWidth;
        }, 4000);
      }
    });
  }
}
