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

import { RolesAndPermissionsEditComponent } from "./roles-and-permissions-edit/roles-and-permissions-edit.component";
import { UserEditService } from "./roles-and-permissions-edit/user-edit.service";
import { RolesAndPermissionsListComponent } from "./roles-and-permissions-list/roles-and-permissions-list.component";
import { UserListService } from "./roles-and-permissions-list/user-list.service";
import { RolesAndPermissionsViewComponent } from "./roles-and-permissions-view/roles-and-permissions-view.component";
import { UserViewService } from "./roles-and-permissions-view/user-view.service";
import { NewUserSidebarComponent } from "./roles-and-permissions-list/new-user-sidebar/new-user-sidebar.component";
import { TruncatePipe } from "../truncate.pipe";
import { SharedModule } from "../shared.module";

// routing
const routes: Routes = [
  {
    path: "roles-and-permissions",
    component: RolesAndPermissionsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "RolesAndPermissionsListComponent" },
  },
  {
    path: "",
    component: RolesAndPermissionsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "RolesAndPermissionsListComponent" },
  },
  {
    path: "roles-and-permissions-view/:id",
    component: RolesAndPermissionsViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: {
      path: "view/:id",
      animation: "RolesAndPermissionsViewComponent",
    },
  },
  {
    path: "roles-and-permissions-edit/:id",
    component: RolesAndPermissionsEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "RolesAndPermissionsEditComponent" },
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
    RolesAndPermissionsListComponent,
    RolesAndPermissionsViewComponent,
    RolesAndPermissionsEditComponent,
    NewUserSidebarComponent
  ],
  imports: [
    SharedModule,
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
export class RolesAndPermissionsModule {}
