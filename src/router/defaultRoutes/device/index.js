//存放不属于菜单项的路由，例如查看详情等页面
const router = [
  {//新增设备
    component: () => import("@/views/device/deviceView/add.vue"), // 页面组件地址
    path: "/device/addDevice", // url地址
    name: '新增设备',
    meta: {keepAlive: 1}
  },
  {//新增组合
    component: () => import("@/views/device/deviceView/add.vue"), // 页面组件地址
    path: "/device/addComponsition", // url地址
    name: '新增组合',
    meta: {keepAlive: 1}
  },
  {//查看设备 组合
    component: () => import("@/views/device/deviceView/view.vue"),
    path: "/device/viewDevice",
    name: '查看设备',
    meta: {keepAlive: 1}
  },
  {//查看设备 组合
    component: () => import("@/views/device/deviceView/view.vue"),
    path: "/device/viewComponsition",
    name: '查看组合',
    meta: {keepAlive: 1}
  },
];
export default router;