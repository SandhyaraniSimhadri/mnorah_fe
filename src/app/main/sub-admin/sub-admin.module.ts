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
import { SubAdminListComponent } from './sub-admin-list/sub-admin-list.component';
import { NewUserSidebarComponent } from './sub-admin-list/new-user-sidebar/new-user-sidebar.component';
import { UserListService } from './sub-admin-list/user-list.service';
import { SubAdminViewComponent } from './sub-admin-view/sub-admin-view.component';
import { UserViewService } from './sub-admin-view/user-view.service';
import { SubAdminEditComponent } from './sub-admin-edit/sub-admin-edit.component';
import { UserEditService } from './sub-admin-edit/user-edit.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

// routing
const routes: Routes = [
  {
    path: 'sub-admin-management',
    component: SubAdminListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'SubAdminListComponent' }
  },
  {
    path: '',
    component: SubAdminListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'SubAdminListComponent' }
  },
  {
    path: 'sub-admin-view/:id',
    component: SubAdminViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'SubAdminViewComponent' }
  },
  {
    path: 'sub-admin-edit/:id',
    component: SubAdminEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'SubAdminEditComponent' }
  },
  {
    path: 'user-view',
    redirectTo: '/apps/user/user-view/2' // Redirection
  },
  {
    path: 'super-admin-edit',
    redirectTo: '/sub-admin-edit/2' // Redirection
  }
];

@NgModule({
  declarations: [SubAdminListComponent, 
    SubAdminViewComponent, SubAdminEditComponent, 
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
export class SubAdminModule {}
