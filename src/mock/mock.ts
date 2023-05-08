import Mock from "mockjs";

Mock.mock("/v1.0/sysUser/page", "post", {
  code: 0,
  message: "",
  data: {
    list: [
      {
        avatar: "",
        username: "束带结发四间房",
        realName: "ssds",
        nickName: "sss",
        deptName: "ddd",
        character: "fff",
        status: 1,
        phone: 19227307203,
        remark:
          "是否收到回复is恢复刷卡缴费和数据的恢复会计师SDK解放后开始交电话费",
        createTime: "2020-12-12-20:20:20",
        id: "111",
      },
      {
        avatar: "",
        username: "he",
        realName: "dfdsf",
        nickName: "dd",
        deptName: "ss",
        character: "ddd",
        status: 0,
        phone: 19227307203,
        remark:
          "时代峰峻收到回复开机时都会发生的方式开发计划收到回复开始的恢复我陪UR噢无人驾驶大V还告诉亚特无法",
        createTime: "2020-12-12-20:20:20",
        id: "222",
      },
    ],
    pageSize: 10,
    total: 100,
  },
});

Mock.mock("/v1.0/sysRole/page", "post", {
  code: 0,
  message: "",
  data: {
    list: [
      {
        roleName: "管理员",
        status: 1,
        remark:
          "是否收到回复is恢复刷卡缴费和数据的恢复会计师SDK解放后开始交电话费",
        createTime: "2020-12-12-20:20:20",
        updateTime: "2022-12-12-20:20:20",
        id: "111",
      },
      {
        roleName: "系统管理员",
        status: 0,
        remark:
          "时代峰峻收到回复开机时都会发生的方式开发计划收到回复开始的恢复我陪UR噢无人驾驶大V还告诉亚特无法",
        createTime: "2020-12-12-20:20:20",
        updateTime: "2022-12-12-20:20:20",
        id: "222",
      },
    ],
    pageSize: 10,
    total: 100,
  },
});

Mock.mock("/v1.0/sysUser/111", "post", {
  code: 0,
  message: "操作成功",
  data: {
    id: "1",
    password: "",
    regionCode: "410011",
    regionName: "长沙市",
    organizationId: 0,
    username: "sxx",
    realName: "realName",
    phone: "",
    avatar: "",
    clientId: "end",
    status: 1,
    superAdmin: false,
    createTime: "2023-03-06 06:02:39",
    updateTime: "2023-03-06 06:02:39",
    deleted: false,
    roleId: "3",
    roleName: "管理员",
  },
});

Mock.mock("/v1.0/sysRole/111", "post", {
  code: 0,
  message: "操作成功",
  data: {
    id: "3",
    name: "管理员",
    sort: 12,
    remark: "哈哈",
    status: 1,
    createTime: "2023-03-06 07:39:14",
    updateTime: "2023-03-06 07:39:14",
    deleted: false,
    resourceIds: ["1-1-0", "1-1-2", "1-2-1"],
  },
});

Mock.mock("/v1.0/sysOperateLog/page", "get", {
  code: 0,
  message: "操作成功",
  data: {
    total: 9,
    list: [
      {
        id: "6406dd006dc54903e064aeb4",
        type: 1,
        title: "角色分页列表查询",
        serviceName: "dhs-java",
        ip: "127.0.0.1",
        ipAddress: "内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysRole/page",
        method: "com.dhs.busi.controller.SysRoleController.page()",
        requestMethod: "GET",
        params:
          '{"pageSize":20,"sysRoleDTO":{"pageNum":0,"pageSize":10,"order":"","orderList":[],"keyword":"","id":"","name":"","sort":0,"remark":"","status":0,"createTime":null,"updateTime":null,"deleted":false,"resourceIds":[],"roleIds":[]},"pageNum":1}',
        costTime: "44",
        exceptionInfo: "",
        responseResult:
          '{"total":1,"list":[{"createTime":"2023-03-06 07:39:14","updateTime":"2023-03-06 07:39:14","deleted":false,"id":"3","name":"管理员1","sort":0,"remark":"test","status":1}],"pageNum":1,"pageSize":1,"size":1,"startRow":0,"endRow":0,"pages":1,"prePage":0,"nextPage":0,"isFirstPage":true,"isLastPage":true,"hasPreviousPage":false,"hasNextPage":false,"navigatePages":8,"navigatepageNums":[1],"navigateFirstPage":1,"navigateLastPage":1}',
        creatorId: "",
        creator: "",
        createTime: "2023-03-07 06:43:12",
        deleted: false,
      },
      {
        id: "6406dcd76dc54903e064aeb3",
        type: 1,
        title: "角色批量删除",
        serviceName: "dhs-java",
        ip: "127.0.0.1",
        ipAddress: "内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysRole/delete",
        method: "com.dhs.busi.controller.SysRoleController.batchDelete()",
        requestMethod: "DELETE",
        params:
          '{"sysRoleDTO":{"pageNum":0,"pageSize":10,"order":"","orderList":[],"keyword":"","id":"","name":"","sort":0,"remark":"","status":0,"createTime":null,"updateTime":null,"deleted":false,"resourceIds":[],"roleIds":["4","5","6"]}}',
        costTime: "15596",
        exceptionInfo: "",
        responseResult: "true",
        creatorId: "",
        creator: "",
        createTime: "2023-03-07 06:42:31",
        deleted: false,
      },
      {
        id: "6406dab96dc54943d46775a6",
        type: 1,
        title: "角色详情查看",
        serviceName: "dhs-java",
        ip: "127.0.0.1",
        ipAddress: "内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysRole/delete",
        method: "com.dhs.busi.controller.SysRoleController.detail()",
        requestMethod: "GET",
        params: '{"id":"delete"}',
        costTime: "1268",
        exceptionInfo: "",
        responseResult: "null",
        creatorId: "",
        creator: "",
        createTime: "2023-03-07 06:33:26",
        deleted: false,
      },
      {
        id: "6406c7f06dc5493cdc13920d",
        type: 1,
        title: "角色修改",
        serviceName: "dhs-java",
        ip: "127.0.0.1",
        ipAddress: "内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysRole",
        method: "com.dhs.busi.controller.SysRoleController.update()",
        requestMethod: "PUT",
        params:
          '{"sysRoleDTO":{"pageNum":0,"pageSize":10,"order":"","orderList":[],"keyword":"","id":"3","name":"管理员1","sort":0,"remark":"test","status":0,"createTime":null,"updateTime":null,"deleted":false,"resourceIds":["1","2","3"]}}',
        costTime: "5034",
        exceptionInfo: "",
        responseResult: "true",
        creatorId: "",
        creator: "",
        createTime: "2023-03-07 05:13:18",
        deleted: false,
      },
      {
        id: "64059bcd9befc156b0e9eb6f",
        type: 1,
        title: "用户详情",
        serviceName: "dhs-java",
        ip: "192.168.5.120",
        ipAddress: "内网IP: 内网IP内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysUser/1",
        method: "com.dhs.busi.controller.SysUserController.detail()",
        requestMethod: "GET",
        params: '{"id":"1"}',
        costTime: "4836",
        exceptionInfo: "",
        responseResult:
          '{"id":"1","username":"admin","password":"","regionCode":"410011","regionName":"长沙市","organizationId":0,"realName":"","phone":"","avatar":"","clientId":"end","status":1,"superAdmin":false,"createTime":"2023-03-06 06:02:39","updateTime":"2023-03-06 06:02:39","deleted":false,"roleId":"3","roleName":"管理员"}',
        creatorId: "",
        creator: "",
        createTime: "2023-03-06 07:52:45",
        deleted: false,
      },
      {
        id: "64059aae9befc12820e6bb57",
        type: 1,
        title: "用户详情",
        serviceName: "dhs-java",
        ip: "192.168.5.120",
        ipAddress: "内网IP: 内网IP内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysUser/1",
        method: "com.dhs.busi.controller.SysUserController.detail()",
        requestMethod: "GET",
        params: '{"id":"1"}',
        costTime: "3565",
        exceptionInfo: "",
        responseResult:
          '{"id":"1","username":"admin","password":"","regionCode":"410011","regionName":"长沙市","organizationId":0,"realName":"","phone":"","avatar":"","clientId":"end","status":1,"superAdmin":false,"createTime":"2023-03-06 06:02:39","updateTime":"2023-03-06 06:02:39","deleted":false,"roleId":"","roleName":"管理员"}',
        creatorId: "",
        creator: "",
        createTime: "2023-03-06 07:47:57",
        deleted: false,
      },
      {
        id: "640599d99befc14ae0ff842d",
        type: 1,
        title: "用户详情",
        serviceName: "dhs-java",
        ip: "192.168.5.120",
        ipAddress: "内网IP: 内网IP内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysUser/1",
        method: "com.dhs.busi.controller.SysUserController.detail()",
        requestMethod: "GET",
        params: '{"id":"1"}',
        costTime: "18551",
        exceptionInfo: "",
        responseResult:
          '{"id":"1","username":"admin","password":"","regionCode":"410011","regionName":"长沙市","organizationId":0,"realName":"","phone":"","avatar":"","clientId":"end","status":1,"superAdmin":false,"createTime":"2023-03-06 06:02:39","updateTime":"2023-03-06 06:02:39","deleted":false,"roleId":"","roleName":""}',
        creatorId: "",
        creator: "",
        createTime: "2023-03-06 07:44:25",
        deleted: false,
      },
      {
        id: "640599c29befc14ae0ff842c",
        type: 1,
        title: "用户详情",
        serviceName: "dhs-java",
        ip: "192.168.5.120",
        ipAddress: "内网IP: 内网IP内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysUser/1",
        method: "com.dhs.busi.controller.SysUserController.detail()",
        requestMethod: "GET",
        params: '{"id":"1"}',
        costTime: "2501",
        exceptionInfo: "",
        responseResult:
          '{"id":"1","username":"admin","password":"","regionCode":"410011","regionName":"长沙市","organizationId":0,"realName":"","phone":"","avatar":"","clientId":"end","status":1,"superAdmin":false,"createTime":"2023-03-06 06:02:39","updateTime":"2023-03-06 06:02:39","deleted":false,"roleId":"","roleName":""}',
        creatorId: "",
        creator: "",
        createTime: "2023-03-06 07:44:01",
        deleted: false,
      },
      {
        id: "6405999d9befc14ae0ff842b",
        type: 1,
        title: "用户详情",
        serviceName: "dhs-java",
        ip: "192.168.5.120",
        ipAddress: "内网IP: 内网IP内网IP",
        userAgent: "PostmanRuntime/7.31.1",
        requestUri: "/v1.0/sysUser/1",
        method: "com.dhs.busi.controller.SysUserController.detail()",
        requestMethod: "GET",
        params: '{"id":"1"}',
        costTime: "937",
        exceptionInfo: "",
        responseResult:
          '{"id":"1","username":"admin","password":"","regionCode":"410011","regionName":"长沙市","organizationId":0,"realName":"","phone":"","avatar":"","clientId":"end","status":1,"superAdmin":false,"createTime":"2023-03-06 06:02:39","updateTime":"2023-03-06 06:02:39","deleted":false,"roleId":"","roleName":""}',
        creatorId: "",
        creator: "",
        createTime: "2023-03-06 07:43:25",
        deleted: false,
      },
    ],
    pageNum: 1,
    pageSize: 20,
    size: 9,
    startRow: 1,
    endRow: 9,
    pages: 1,
    prePage: 0,
    nextPage: 0,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
    navigatePages: 8,
    navigatepageNums: [1],
    navigateFirstPage: 1,
    navigateLastPage: 1,
  },
});

Mock.mock("/v1.0/sysResource/tree", "get", {
  code: 0,
  message: "操作成功",
  data: [
    {
      id: "1",
      name: "管理员",
      parentId: "0",
      type: 1,
      path: "/user",
      sort: 2,
      remark: "哈哈",
      status: 1,
      create_time: "2022-12-12 20:20:20",
      children: [
        {
          id: "1-1",
          name: "管理员",
          parentId: "1",
          type: 2,
          path: "/user/user-list",
          sort: 2,
          remark: "哈哈",
          status: 1,
          create_time: "2022-12-12 20:20:20",
        },
        {
          id: "1-2",
          name: "管理员",
          parentId: "1",
          type: 3,
          path: "/user/user-list",
          sort: 3,
          remark: "哈哈",
          status: 2,
          create_time: "2022-12-12 20:20:20",
        },
      ],
    },
    {
      id: "2",
      name: "管理员2",
      parentId: "0",
      type: 3,
      path: "/user",
      sort: 3,
      remark: "哈哈",
      status: 1,
      create_time: "2022-12-12 20:20:20",
      children: [
        {
          id: "2-2-1",
          name: "管理员",
          parentId: "1",
          type: 4,
          path: "/user/user-list",
          sort: 2,
          remark: "哈哈",
          status: 1,
          create_time: "2022-12-12 20:20:20",
        },
        {
          id: "2-2-2",
          name: "管理员",
          parentId: "1",
          type: 5,
          path: "/user/user-list",
          sort: 3,
          remark: "哈哈",
          status: 2,
          create_time: "2022-12-12 20:20:20",
        },
      ],
    },
  ],
});

// 登录
Mock.mock("/v1.0/login/admin", "post", {
  code: 0,
  message: "操作成功",
  data: {
    id: "6396cddf1a4afe167885797f",
    username: "jasmine",
    password: "",
    regionCode: "4100",
    regionName: "湖南省",
    organizationId: 0,
    realName: "jasmine",
    phone: "",
    avatar: "",
    clientId: "end",
    status: 1,
    superAdmin: false,
    createdTime: null,
    updateTime: "2022-12-12 14:44:46",
    token: "990ce234-8ba2-4da5-931e-cce302962be9",
    loginType: "end",
    roleIdList: ["1", "2"],
    resourceList: [
      {
        id: "123456",
        path: "/user",
        children: [
          {
            id: "123456-1",
            path: "/user/list",
          },
          {
            id: "123456-2",
            path: "/user/permissions",
          },
        ],
      },
    ],
  },
});

Mock.mock("/v1.0/sightResourceStatistics/page?pageSize=10&pageNum=1", "get", {
  code: 0,
  message: "操作成功",
  data: {
    list: [
      {
        id: "111",
        type: 1,
        nationalCount: "111",
        provinceCount: "222",
        fiveACount: "333",
        fourACount: "444",
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
      {
        id: "222",
        type: 0,
        nationalCount: "111",
        provinceCount: "222",
        fiveACount: "333",
        fourACount: "444",
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
    ],
    total: 100,
    pageSize: 10,
    pageNum: 1,
  },
});

Mock.mock("/v1.0/sightResourceStatistics/batchDelete", "delete", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/sightResourceStatistics", "post", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/sightResourceStatistics", "put", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/sightResourceStatistics/111", "get", {
  code: 0,
  message: "操作成功",
  data: {
    type: 1,
    nationalCount: "aaa",
    provinceCount: "bbb",
    fiveACount: "ccc",
    fourACount: "ddd",
  },
});

Mock.mock("/v1.0/historyTravelIndex/page?pageSize=10&pageNum=1", "get", {
  code: 0,
  message: "操作成功",
  data: {
    list: [
      {
        id: "111",
        type: 1,
        year: "2023",
        population: "222",
        income: "333",
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
      {
        id: "222",
        type: 0,
        year: "2023",
        population: "222",
        income: "333",
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
    ],
    total: 100,
    pageSize: 10,
    pageNum: 1,
  },
});

Mock.mock("/v1.0/historyTravelIndex/batchDelete", "delete", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/historyTravelIndex", "post", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/historyTravelIndex", "put", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/historyTravelIndex/111", "get", {
  code: 0,
  message: "操作成功",
  data: {
    type: 1,
    year: "2023",
    population: 1234,
    income: 1222,
  },
});

Mock.mock("/v1.0/travelInvest/page?pageSize=10&pageNum=1", "get", {
  code: 0,
  message: "操作成功",
  data: {
    list: [
      {
        id: "111",
        investmentProgram: "ssxxs",
        investmentCost: 12345,
        buildingProgram: "2023",
        buildingCost: 12345,
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
      {
        id: "222",
        investmentProgram: "ssxxs",
        investmentCost: 12345,
        buildingProgram: "2023",
        buildingCost: 12345,
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
    ],
    total: 100,
    pageSize: 10,
    pageNum: 1,
  },
});

Mock.mock("/v1.0/travelInvest/batchDelete", "delete", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/travelInvest", "post", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/travelInvest", "put", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/travelInvest/111", "get", {
  code: 0,
  message: "操作成功",
  data: {
    id: "111",
    investmentProgram: "ssxxs",
    investmentCost: 12345,
    buildingProgram: "2023",
    buildingCost: 12345,
  },
});

Mock.mock("/v1.0/hingeNum/page?pageSize=10&pageNum=1", "get", {
  code: 0,
  message: "操作成功",
  data: {
    list: [
      {
        id: "111",
        railwayStation: "ssxxs",
        airport: 12345,
        tollGate: "2023",
        passengerStation: 12345,
        airStation: "2022-11-11 12:21:12",
        type: 1,
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
      {
        id: "222",
        railwayStation: "ssxxs",
        airport: 12345,
        tollGate: "2023",
        passengerStation: 12345,
        airStation: "2022-11-11 12:21:12",
        type: 0,
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
    ],
    total: 100,
    pageSize: 10,
    pageNum: 1,
  },
});

Mock.mock("/v1.0/hingeNum/batchDelete", "delete", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/hingeNum", "post", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/hingeNum", "put", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/hingeNum/111", "get", {
  code: 0,
  message: "操作成功",
  data: {
    id: "111",
    railwayStation: "ssxxs",
    airport: 12345,
    tollGate: "2023",
    passengerStation: 12345,
    airStation: "2022-11-11 12:21:12",
    type: 0,
  },
});

Mock.mock("/v1.0/travelWay/page?pageSize=10&pageNum=1", "get", {
  code: 0,
  message: "操作成功",
  data: {
    list: [
      {
        id: "111",
        plane: 123445,
        train: 12345,
        drive: 123,
        ship: 12345,
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
      {
        id: "222",
        plane: 123445,
        train: 12345,
        drive: 123,
        ship: 12345,
        createTime: "2022-11-11 12:21:12",
        updateTime: "2022-12-11 12:21:12",
      },
    ],
    total: 100,
    pageSize: 10,
    pageNum: 1,
  },
});

Mock.mock("/v1.0/travelWay/batchDelete", "delete", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/travelWay", "post", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/travelWay", "put", {
  code: 0,
  message: "操作成功",
  data: null,
});

Mock.mock("/v1.0/travelWay/111", "get", {
  code: 0,
  message: "操作成功",
  data: {
    id: "111",
    plane: 123445,
    train: 12345,
    drive: 123,
    ship: 12345,
  },
});
