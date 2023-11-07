import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';

import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';
import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';

// import { UserEditComponent } from 'app/main/apps/user/user-edit/user-edit.component';
// import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';

// import { UserListComponent } from 'app/main/apps/user/user-list/user-list.component';

// import { UserListService } from 'app/main/apps/user/user-list/user-list.service';

// import { UserViewComponent } from 'app/main/apps/user/user-view/user-view.component';
// import { UserViewService } from 'app/main/apps/user/user-view/user-view.service';
// import { NewUserSidebarComponent } from 'app/main/apps/user/user-list/new-user-sidebar/new-user-sidebar.component';
// import { SubAdminListComponent } from './sub-admin-list/sub-admin-list.component';
// import { NewUserSidebarComponent } from './sub-admin-list/new-user-sidebar/new-user-sidebar.component';
// import { UserListService } from './sub-admin-list/user-list.service';
// import { SubAdminViewComponent } from './sub-admin-view/sub-admin-view.component';
// import { UserViewService } from './sub-admin-view/user-view.service';
// import { SubAdminEditComponent } from './sub-admin-edit/sub-admin-edit.component';
// import { UserEditService } from './sub-admin-edit/user-edit.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MemberManagementListComponent } from './member-management-list/member-management-list.component';
import { NewUserSidebarComponent } from './member-management-list/new-user-sidebar/new-user-sidebar.component';
import { UserListService } from './member-management-list/user-list.service';
import { MemberManagementEditComponent } from './member-management-edit/member-management-edit.component';
import { MemberManagementViewComponent } from './member-management-view/member-management-view.component';
import { UserEditService } from './member-management-edit/user-edit.service';
import { UserViewService } from './member-management-view/user-view.service';
const routes: Routes = [
  {
    path: 'member-management',
    component: MemberManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'MemberManagementListComponent' }
  },
  {
    path: '',
    component: MemberManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'MemberManagementListComponent' }
  },
  {
    path: 'member-management-view/:id',
    component: MemberManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'MemberManagementViewComponent' }
  },
  {
    path: 'member-management-edit/:id',
    component: MemberManagementEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'MemberManagementEditComponent' }
  },
  {
    path: 'member-management-view',
    redirectTo: '/member-management-view/2' // Redirection
  },
  {
    path: 'member-management-edit',
    redirectTo: '/member-management-edit/2' // Redirection
  }
];

@NgModule({
  declarations: [MemberManagementListComponent, 
    MemberManagementViewComponent, MemberManagementEditComponent, 
    NewUserSidebarComponent],
  imports: [
    NgbModule,
    NgbNavModule,
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule
  ],
  providers: [UserListService, 
    UserViewService, 
    UserEditService,
  ]
})
export class MemberManagementModule {}
