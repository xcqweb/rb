//存放不属于菜单项的路由，例如查看详情等页面
const router = [
  {//查看模型
    
    component: () => import("@/views/model/viewModel.vue"), // 页面组件地址
    path: "/model/viewModel", // url地址
    name: '查看模型',
    meta: {keepAlive:1}
  },
  {//新增模型
    component: () => import("@/views/model/addModel.vue"),
    path: "/model/addModel",
    name: '新增模型',
    meta: {keepAlive:1}
  },
];
export default router;