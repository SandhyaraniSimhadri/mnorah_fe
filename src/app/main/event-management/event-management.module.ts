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

import { EventManagementEditComponent } from './event-management-edit/event-management-edit.component';
import { UserEditService } from './event-management-edit/user-edit.service';
import { EventManagementListComponent } from './event-management-list/event-management-list.component';
import { UserListService } from './event-management-list/user-list.service';
import { EventManagementViewComponent } from './event-management-view/event-management-view.component';
import { UserViewService } from './event-management-view/user-view.service';
import { NewUserSidebarComponent } from './event-management-list/new-user-sidebar/new-user-sidebar.component';

// routing
const routes: Routes = [
  {
    path: 'event-management',
    component: EventManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'EventManagementListComponent' }
  },
  {
    path: '',
    component: EventManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'EventManagementListComponent' }
  },
  {
    path: 'event-management-view/:id',
    component: EventManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'EventManagementViewComponent' }
  },
  {
    path: 'event-management-edit/:id',
    component: EventManagementEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'EventManagementEditComponent' }
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
  declarations: [EventManagementListComponent, 
    EventManagementViewComponent, EventManagementEditComponent, 
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
export class EventManagementModule {}
