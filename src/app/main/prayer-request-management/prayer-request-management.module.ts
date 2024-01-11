import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2FlatpickrModule } from "ng2-flatpickr";

import { CoreCommonModule } from "@core/common.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";

import { InvoiceListService } from "app/main/apps/invoice/invoice-list/invoice-list.service";
import { InvoiceModule } from "app/main/apps/invoice/invoice.module";

import { PrayerRequestManagementEditComponent } from "./prayer-request-management-edit/prayer-request-management-edit.component";
import { UserEditService } from "./prayer-request-management-edit/user-edit.service";
import { PrayerRequestManagementListComponent } from "./prayer-request-management-list/prayer-request-management-list.component";
import { UserListService } from "./prayer-request-management-list/user-list.service";
import { PrayerRequestManagementViewComponent } from "./prayer-request-management-view/prayer-request-management-view.component";
import { UserViewService } from "./prayer-request-management-view/user-view.service";
import { NewUserSidebarComponent } from "./prayer-request-management-list/new-user-sidebar/new-user-sidebar.component";
import { TruncatePipe } from "../truncate.pipe";

// routing
const routes: Routes = [
  {
    path: "prayer-request-management",
    component: PrayerRequestManagementListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "PrayerRequestManagementListComponent" },
  },
  {
    path: "",
    component: PrayerRequestManagementListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "PrayerRequestManagementListComponent" },
  },
  {
    path: "prayer-request-management-view/:id",
    component: PrayerRequestManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: {
      path: "view/:id",
      animation: "PrayerRequestManagementViewComponent",
    },
  },
  {
    path: "prayer-request-management-edit/:id",
    component: PrayerRequestManagementEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "PrayerRequestManagementEditComponent" },
  },
  {
    path: "user-view",
    redirectTo: "/apps/user/user-view/2", // Redirection
  },
  {
    path: "user-edit",
    redirectTo: "/apps/user/user-edit/2", // Redirection
  },
];

@NgModule({
  declarations: [
    PrayerRequestManagementListComponent,
    PrayerRequestManagementViewComponent,
    PrayerRequestManagementEditComponent,
    NewUserSidebarComponent,TruncatePipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule,
  ],
  providers: [UserListService, UserViewService, UserEditService],
})
export class PrayerRequestManagementModule {}
