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


import { TestimonyManagementEditComponent } from './testimony-management-edit/testimony-management-edit.component';
import { UserEditService } from './testimony-management-edit/user-edit.service';
import { TestimonyManagementListComponent } from './testimony-management-list/testimony-management-list.component';
import { UserListService } from './testimony-management-list/user-list.service';
import { TestimonyManagementViewComponent } from './testimony-management-view/testimony-management-view.component';
import { UserViewService } from './testimony-management-view/user-view.service';
import { NewUserSidebarComponent } from './testimony-management-list/new-user-sidebar/new-user-sidebar.component';
import { TruncatePipe } from '../truncate.pipe';
import { SharedModule } from '../shared.module';

// routing
const routes: Routes = [
  {
    path: 'testimony-management',
    component: TestimonyManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'TestimonyManagementListComponent' }
  },
  {
    path: '',
    component: TestimonyManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'TestimonyManagementListComponent' }
  },
  {
    path: 'testimony-management-view/:id',
    component: TestimonyManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'TestimonyManagementViewComponent' }
  },
  {
    path: 'testimony-management-edit/:id',
    component: TestimonyManagementEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'TestimonyManagementEditComponent' }
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
  declarations: [TestimonyManagementListComponent,
    TestimonyManagementViewComponent, TestimonyManagementEditComponent, 
    NewUserSidebarComponent],
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
    CoreSidebarModule
  ],
  providers: [UserListService, 
    UserViewService, 
    UserEditService
  ]
})
export class TestimonyManagementModule {}
