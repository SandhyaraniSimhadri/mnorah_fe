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

import { FeedManagementEditComponent } from './feed-management-edit/feed-management-edit.component';
import { UserEditService } from './feed-management-edit/user-edit.service';
import { FeedManagementListComponent } from './feed-management-list/feed-management-list.component';
import { UserListService } from './feed-management-list/user-list.service';
import { FeedManagementViewComponent } from './feed-management-view/feed-management-view.component';
import { UserViewService } from './feed-management-view/user-view.service';
import { NewUserSidebarComponent } from './feed-management-list/new-user-sidebar/new-user-sidebar.component';

// routing
const routes: Routes = [
  {
    path: 'feed-management',
    component: FeedManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'FeedManagementListComponent' }
  },
  {
    path: '',
    component: FeedManagementListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'FeedManagementListComponent' }
  },
  {
    path: 'feed-management-view/:id',
    component: FeedManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'FeedManagementViewComponent' }
  },
  {
    path: 'feed-management-edit/:id',
    component: FeedManagementEditComponent
    ,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'FeedManagementEditComponent' }
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
  declarations: [FeedManagementListComponent, 
    FeedManagementViewComponent, FeedManagementEditComponent, 
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
export class FeedManagementModule {}
