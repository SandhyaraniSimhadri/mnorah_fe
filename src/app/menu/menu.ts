import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
 
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'MENU.DASHBOARD.DASHBOARD',
    type: 'item',
    icon: 'home',
    role:['Super Admin','Sub Admin'],
    url: 'dashboard'
  },
  {
    id: 'church-management',
    title: 'Church',
    translate: 'MENU.CHURCH_MANAGEMENT.CHURCH_MANAGEMENT',
    type: 'item',
    icon: 'life-buoy',
    role:['Super Admin'],
    url: 'church-management'
  },
  {
    id: 'sub-admin',
    title: 'Sub Admin',
    translate: 'MENU.SUB_ADMIN_MANAGEMENT.SUB_ADMIN_MANAGEMENT',
    type: 'item',
    icon: 'user-plus',
    role:['Super Admin'],
    url: 'sub-admin'
  },
  
  {
    id: 'member-management',
    title: 'Member',
    translate: 'MENU.MEMBER_MANAGEMENT.MEMBER_MANAGEMENT',
    type: 'item',
    icon: 'users',
    role:['Super Admin','Sub Admin'],
    url: 'member-management'
  },
  {
    id: 'feed-management',
    title: 'Feed',
    translate: 'MENU.FEED_MANAGEMENT.FEED_MANAGEMENT',
    type: 'item',
    icon: 'film',
    role:['Super Admin','Sub Admin'],
    url: 'feed-management'
  },
  {
    id: 'event-management',
    title: 'Event',
    translate: 'MENU.EVENT_MANAGEMENT.EVENT_MANAGEMENT',
    type: 'item',
    icon: 'calendar',
    role:['Super Admin','Sub Admin'],
    url: 'event-management'
  },
  {
    id: 'visitor-management',
    title: 'Visitor',
    translate: 'MENU.VISITOR_MANAGEMENT.VISITOR_MANAGEMENT',
    type: 'item',
    icon: 'link',
    role:['Super Admin','Sub Admin'],
    url: 'visitor-management'
  },

  {
    id: 'testimony-management',
    title: 'Testimony',
    translate: 'MENU.TESTIMONY_MANAGEMENT.TESTIMONY_MANAGEMENT',
    type: 'item',
    icon: 'feather',
    role:['Super Admin','Sub Admin'],
    url: 'testimony-management'
  },

  {
    id: 'life-group-management',
    title: 'Life Group',
    translate: 'MENU.LIFE_GROUP_MANAGEMENT.LIFE_GROUP_MANAGEMENT',
    type: 'item',
    icon: 'life-buoy',
    role:['Super Admin','Sub Admin'],
    url: 'life-group-management'
  },

  {
    id: 'prayer-request-management',
    title: 'Prayer Request',
    translate: 'MENU.PRAYER_REQUEST_MANAGEMENT.PRAYER_REQUEST_MANAGEMENT',
    type: 'item',
    icon: 'zap',
    role:['Super Admin','Sub Admin'],
    url: 'prayer-request-management'
  },

  {
    id: 'roles-and-permissions',
    title: 'Roles & Permissions',
    translate: 'MENU.ROLES_AND_PERMISSIONS.ROLES_AND_PERMISSIONS',
    type: 'item',
    icon: 'zap',
    role:['Super Admin','Sub Admin'],
    url: 'roles-and-permissions'
  }
];
