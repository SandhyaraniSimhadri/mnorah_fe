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

import { ChurchManagementEditComponent } from './church-management-edit/church-management-edit.component';
import { UserEditService } from './church-management-edit/user-edit.service';
import { ChurchManagementListComponent } from './church-management-list/church-management-list.component';
import { UserListService } from './church-management-list/user-list.service';
import { ChurchManagementViewComponent } from './church-management-view/church-management-view.component';
import { UserViewService } from './church-management-view/user-view.service';
import { NewUserSidebarComponent } from './church-management-list/new-user-sidebar/new-user-sidebar.component';
import { DeleteDailogueBoxComponent } from '../components/delete-dailogue-box/delete-dailogue-box.component';

// routing
const routes: Routes = [
  {
    path: 'church-management',
    component: ChurchManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'ChurchManagementListComponent' }
  },
  {
    path: '',
    component: ChurchManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'ChurchManagementListComponent' }
  },
  {
    path: 'church-management-view/:id',
    component: ChurchManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'ChurchManagementViewComponent' }
  },
  {
    path: 'church-management-edit/:id',
    component: ChurchManagementEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'ChurchManagementEditComponent' }
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
  declarations: [ChurchManagementListComponent, 
    ChurchManagementViewComponent, ChurchManagementEditComponent, 
    NewUserSidebarComponent,DeleteDailogueBoxComponent],
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
export class ChurchManagementModule {}
