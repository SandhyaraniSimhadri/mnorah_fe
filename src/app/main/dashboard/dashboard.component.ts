import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

import { first } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";

import { colors } from "app/colors.const";
import { User } from "app/auth/models";
import { UserService } from "app/auth/service";
import { CoreHttpService } from "@core/services/http.service";
import { menu } from "app/menu/menu";
import { CoreMenu } from "@core/types";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  // Decorator
  @ViewChild("visitorsChartRef") visitorsChartRef: any;
  @ViewChild("orderChartRef") orderChartRef: any;

  @ViewChild("membersChartRef") membersChartRef: any;
  @ViewChild("requestsChartRef") requestsChartRef: any;
  @ViewChild("testimoniesChartRef") testimoniesChartRef: any;
  @ViewChild("feedsChartRef") feedsChartRef: any;
  @ViewChild("lifegroupChartRef") lifegroupChartRef: any;
  @ViewChild("churchesChartRef") churchesChartRef: any;
  @ViewChild("adminsChartRef") adminsChartRef: any;



  // Public
  public data: any;
  public currentUser: any;
  public loading: boolean = false;
  public users: User[] = [];
  public visitorChartoptions;
  public membersChartoptions;
  public requestsChartoptions;
  public testimoniesChartoptions;
  public feedsChartoptions;
  public adminsChartoptions;
  public lifegroupsChartoptions;
  public churchesChartoptions;
  public orderChartoptions;
  public isMenuToggled = true;

  // Private
  private $primary = "#7367F0";
  private $secondary = "#6c757d";
  private $warning = "#FF9F43";
  private $info = "#00cfe8";
  private $success = "#28a745";
  private $danger = "#dc3545";
  private $mute = "#c3c3c3";

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
  public light = "#6c757d";
  public menu:CoreMenu[] = [];
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
    this.menu=menu
    this.visitorChartoptions = {

      colors: [this.$warning],
    
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
     
    };


    this.membersChartoptions = {
      colors: [this.$primary], 
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
    };

    this.requestsChartoptions = {
      colors: [this.$secondary], 
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
    };

    this.testimoniesChartoptions = {
      colors: [this.$info], 
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
    };


    this.feedsChartoptions = {
      colors: [this.$success], 
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
    };


    this.lifegroupsChartoptions = {
      colors: [this.$info], 
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
    };



    this.churchesChartoptions = {
      colors: [this.$mute], 
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
    };

    this.adminsChartoptions = {
      colors: [this.$danger], 
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
    };

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

  }

  hasVisitorManagementItem(): boolean {
    return this.menu.filter(item => item.id === 'visitor-management').length > 0;
}
hasMemberManagementItem(): boolean {
  return this.menu.filter(item => item.id === 'member-management').length > 0;
}

hasPrayerRequestItem(): boolean {
  return this.menu.filter(item => item.id === 'prayer-request-management').length > 0;
}

hasTestimonyItem(): boolean {
  return this.menu.filter(item => item.id === 'testimony-management').length > 0;
}
hasFeedItem(): boolean {
  return this.menu.filter(item => item.id === 'feed-management').length > 0;
}
hasLifeGroupItem(): boolean {
  return this.menu.filter(item => item.id === 'life-group-management').length > 0;
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
    this.loading = true;
    let request;
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
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }


  ngAfterViewInit() {
    this.loading=true;
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
          this.visitorChartoptions.chart.width =
            this.visitorsChartRef?.nativeElement.offsetWidth;
          this.membersChartoptions.chart.width =
            this.membersChartRef?.nativeElement.offsetWidth;


            this.requestsChartoptions.chart.width =
            this.requestsChartRef?.nativeElement.offsetWidth;
          this.testimoniesChartoptions.chart.width =
            this.testimoniesChartRef?.nativeElement.offsetWidth;


            this.feedsChartoptions.chart.width =
            this.feedsChartRef?.nativeElement.offsetWidth;
          this.lifegroupsChartoptions.chart.width =
            this.lifegroupChartRef?.nativeElement.offsetWidth;

            this.churchesChartoptions.chart.width =
            this.churchesChartRef?.nativeElement.offsetWidth;
          this.adminsChartoptions.chart.width =
            this.adminsChartRef?.nativeElement.offsetWidth;
   this.orderChartoptions.chart.width =
            this.orderChartRef?.nativeElement.offsetWidth;
            this.loading=false;
      
        }, 4000);
      }
    });
  }
}
