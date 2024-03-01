import { CoreMenu } from "@core/types";

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface
let role_data = JSON.parse(localStorage.getItem("roleinfo"));
let user_data = JSON.parse(localStorage.getItem("currentUser"));

const menuList: CoreMenu[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "MENU.DASHBOARD.DASHBOARD",
    type: "item",
    icon: "home",
    url: "dashboard",
  },
  {
    id: "church-management",
    title: "Church",
    translate: "MENU.CHURCH_MANAGEMENT.CHURCH_MANAGEMENT",
    type: "item",
    icon: "life-buoy",
    url: "church-management",
  },
  {
    id: "sub-admin",
    title: "Sub Admin",
    translate: "MENU.SUB_ADMIN_MANAGEMENT.SUB_ADMIN_MANAGEMENT",
    type: "item",
    icon: "user-plus",

    url: "sub-admin",
  },

  {
    id: "member-management",
    title: "Member",
    translate: "MENU.MEMBER_MANAGEMENT.MEMBER_MANAGEMENT",
    type: "item",
    icon: "users",

    url: "member-management",
  },
  {
    id: "feed-management",
    title: "Feed",
    translate: "MENU.FEED_MANAGEMENT.FEED_MANAGEMENT",
    type: "item",
    icon: "film",
    url: "feed-management",
  },
  {
    id: "event-management",
    title: "Event",
    translate: "MENU.EVENT_MANAGEMENT.EVENT_MANAGEMENT",
    type: "item",
    icon: "calendar",
    url: "event-management",
  },
  {
    id: "visitor-management",
    title: "Visitor",
    translate: "MENU.VISITOR_MANAGEMENT.VISITOR_MANAGEMENT",
    type: "item",
    icon: "link",
    url: "visitor-management",
  },

  {
    id: "testimony-management",
    title: "Testimony",
    translate: "MENU.TESTIMONY_MANAGEMENT.TESTIMONY_MANAGEMENT",
    type: "item",
    icon: "feather",
    url: "testimony-management",
  },

  {
    id: "life-group-management",
    title: "Life Group",
    translate: "MENU.LIFE_GROUP_MANAGEMENT.LIFE_GROUP_MANAGEMENT",
    type: "item",
    icon: "life-buoy",
    url: "life-group-management",
  },

  {
    id: "prayer-request-management",
    title: "Prayer Request",
    translate: "MENU.PRAYER_REQUEST_MANAGEMENT.PRAYER_REQUEST_MANAGEMENT",
    type: "item",
    icon: "zap",
    url: "prayer-request-management",
  },

  {
    id: "roles-and-permissions",
    title: "Roles & Permissions",
    translate: "MENU.ROLES_AND_PERMISSIONS.ROLES_AND_PERMISSIONS",
    type: "item",
    icon: "zap",
    url: "roles-and-permissions",
  },
];

export const getMenu = () => {
  if (user_data?.user_type == 1) {
    // var newMenu: CoreMenu[] = menuList;
    return menuList;
  } else if (user_data?.user_type == 2){
    let newMenu: CoreMenu[] = [
      {
        id: "dashboard",
        title: "Dashboard",
        translate: "MENU.DASHBOARD.DASHBOARD",
        type: "item",
        icon: "home",
        url: "dashboard",
      }
    ];
    for (let i = 0; i < role_data.modules.length; i++) {
      if (
        role_data.modules[i].permissions[0].read === 1 ||
        role_data.modules[i].permissions[0].create === 1 ||
        role_data.modules[i].permissions[0].update === 1 ||
        role_data.modules[i].permissions[0].delete === 1
      ) {
        newMenu.push(menuList[i + 3]);
      }
    }
    return newMenu;
  }
  else{
    // var newMenu: CoreMenu[] = menuList;
    return menuList;
  } 
};

export const menu = getMenu();
