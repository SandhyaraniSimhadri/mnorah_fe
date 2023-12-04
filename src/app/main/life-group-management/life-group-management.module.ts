import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

import { LifeGroupManagementEditComponent } from './life-group-management-edit/life-group-management-edit.component';
import { UserEditService } from './life-group-management-edit/user-edit.service';
import { LifeGroupManagementListComponent } from './life-group-management-list/life-group-management-list.component';
import { UserListService } from './life-group-management-list/user-list.service';
import { LifeGroupManagementViewComponent } from './life-group-management-view/life-group-management-view.component';
import { UserViewService } from './life-group-management-view/user-view.service';
import { NewUserSidebarComponent } from './life-group-management-list/new-user-sidebar/new-user-sidebar.component';

// routing
const routes: Routes = [
  {
    path: 'life-group-management',
    component: LifeGroupManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'LifeGroupManagementListComponent' }
  },
  {
    path: '',
    component: LifeGroupManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'LifeGroupManagementListComponent' }
  },
  {
    path: 'life-group-management-view/:id',
    component: LifeGroupManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'LifeGroupManagementViewComponent' }
  },
  {
    path: 'life-group-management-edit/:id',
    component: LifeGroupManagementEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'LifeGroupManagementEditComponent' }
  },
  {
    path: 'user-view',
    redirectTo: '/apps/user/user-view/2' // Redirection
  },
  {
    path: 'user-edit',
    redirectTo: '/apps/user/user-edit/2' // Redirection
  }
];

@NgModule({
  declarations: [LifeGroupManagementListComponent, 
    LifeGroupManagementViewComponent, LifeGroupManagementEditComponent, 
    NewUserSidebarComponent],
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
    CoreSidebarModule
  ],
  providers: [UserListService, 
    UserViewService, 
    UserEditService
  ]
})
export class LifeGroupManagementModule {}
