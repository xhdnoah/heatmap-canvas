/**
 * 脚本资源路径，动态添加脚本用
 * @type {string}
 */
export const BMAP_SCRIPT_PATH =
  "http://api.map.baidu.com/getscript?v=2.0&ak=IxkVHESdipx5g1Sd8089D7oKA6n0tnhf"
export const HEATMAP_SCRIPT_PATH = "/vendors/Heatmap.min.js"
export const GEOUTILS_SCRIPT_PATH = "/vendors/GeoUtils.min.js"
export const DRAWINGMANAGER_SCRIPT_PATH = "/vendors/DrawingManager.min.js"

/**
 * 善贾token 用于自动登陆
 * */
export const COOKIE_NAME = "shangu_token"
let authToken = ""

/**
 * 登录警告次数，只通知一次重新登录
 */
export const LOGIN_WARNING_COUNT = 0

/**
 * 动态插入script标签绑定的classname, 删除时需要获取
 */
export const BMAP_CLASSNAME = "baidu-script"
export const HEATMAP_CLASSNAME = "baidu-script"
export const GEOUTILS_CLASSNAME = "baidu-script"
export const DRAWINGMANAGER_CLASSNAME = "baidu-script"

export const MONTH_LIST = [{
    key: "Jan",
    title: "1月",
    en_title: "Jan. ",
    targetValue: ""
  },
  {
    key: "Feb",
    title: "2月",
    en_title: "Feb. ",
    targetValue: ""
  },
  {
    key: "Mar",
    title: "3月",
    en_title: "Mar. ",
    targetValue: ""
  },
  {
    key: "Apr",
    title: "4月",
    en_title: "Apr. ",
    targetValue: ""
  },
  {
    key: "May",
    title: "5月",
    en_title: "May. ",
    targetValue: ""
  },
  {
    key: "Jun",
    title: "6月",
    en_title: "Jun. ",
    targetValue: ""
  },
  {
    key: "Jul",
    title: "7月",
    en_title: "Jul. ",
    targetValue: ""
  },
  {
    key: "Aug",
    title: "8月",
    en_title: "Aug. ",
    targetValue: ""
  },
  {
    key: "Sep",
    title: "9月",
    en_title: "Sep. ",
    targetValue: ""
  },
  {
    key: "Oct",
    title: "10月",
    en_title: "Oct. ",
    targetValue: ""
  },
  {
    key: "Nov",
    title: "11月",
    en_title: "Nov. ",
    targetValue: ""
  },
  {
    key: "Dec",
    title: "12月",
    en_title: "Dec. ",
    targetValue: ""
  }
]

const contantMap = {
  // must starts with constant
  constant_data_source: {
    "0": "居住地",
    "1": "办公室"
  },
  constant_customer_type: {
    "4": "客流数",
    "3": "到店数",
    "1": "新顾客",
    "2": "老顾客"
  }
}

export const CHART = {
  label: {
    color: "#4A4A4A"
  }
}

// 访客管理页面table column
export const VISITOR_TABLE_COLUMN = [{
    title: "访客ID",
    en_title: "Visitor ID",
    key: "visitId",
    align: "center",
    width: 108
  },
  {
    title: "顾客头像",
    en_title: "Customer Facial Record",
    key: "customerAvatar",
    align: "center",
    width: 158,
    render: (h, params) => {
      return h("img", {
        attrs: {
          src: params.row.customerAvatar,
          width: "100px",
          height: "100px"
        },
        on: {
          error: e => {
            e.onerror = null
            e.target.src = require("@/assets/images/clerkIcon.png")
          }
        }
      })
    }
  },
  {
    title: "访客头像",
    en_title: "Visitor Facial Record",
    width: 158,
    key: "visitAvatar",
    align: "center",
    // render: (h, params) => {
    //   return h("div", [
    //     h("Avatar", {
    //       props: {
    //         src: params.row.visitAvatar,
    //         size: "large"
    //       }
    //     })
    //   ])
    // }
    render: (h, params) => {
      return h("img", {
        attrs: {
          src: params.row.visitAvatar,
          width: "100px",
          height: "100px"
        },
        on: {
          error: e => {
            e.onerror = null
            e.target.src = require("@/assets/images/clerkIcon.png")
          }
        }
      })
    }
  },
  {
    title: "姓名",
    en_title: "Name",
    key: "name",
    align: "center"
  },
  {
    title: "性别",
    en_title: "Gender",
    key: "gender",
    align: "center"
  },
  {
    title: "年龄段",
    en_title: "Age",
    key: "age",
    align: "center"
  },
  {
    title: "顾客类型",
    en_title: "Customer Type",
    key: "customerType",
    align: "center"
  },
  {
    title: "到访时间",
    en_title: "Visit Time",
    key: "visitTime",
    align: "center",
    render: (h, params) => {
      return h("div", [
        h("p", {}, params.row.visitDate),
        h("p", {}, params.row.visitTime)
      ])
    }
  }
]

/**
 * 顾客总览 请求的属性
 */
export const CUSTOMER_OVERVIEW = {
  ATTR_VISIT_SUM_G_DAY: "visit_sum_g_day",
  ATTR_VISIT_GENDER_G_DAY: "visit_gender_g_day",
  ATTR_VISIT_IMPORTANT_LEVEL_G_DAY: "visit_important_level_g_day",
  ATTR_VISIT_AGE_G_DAY: "visit_age_g_day",
  ATTR_VISIT_SUM_G_HOUR: "visit_sum_g_hour",

  ATTR_CUSTOMER_SUM_G_HOUR: "customer_sum_g_hour",

  ATTR_CUSTOMER_SUM_G_DAY: "customer_sum_g_day",
  ATTR_CUSTOMER_GENDER_G_DAY: "customer_gender_g_day",
  ATTR_CUSTOMER_IMPORTANT_LEVEL_G_DAY: "customer_important_level_g_day",
  ATTR_CUSTOMER_AGE_G_DAY: "customer_age_g_day",
  ATTR_AVG_CUSTOMER_STAY_TIME_G_DAY: "avg_customer_stay_time_g_day"
}

/**
 * 给attributes分组，请求
 */
export const attributesGroup = {
  0: ["visit_gender", "visit_age", "visit_important_level", "visit_sum"],
  1: [
    "visit_gender_g_day",
    "visit_age_g_day",
    "visit_important_level_g_day",
    "visit_sum_g_day"
  ],
  2: ["visit_age_g_hour", "visit_important_level_g_hour", "visit_sum_g_hour"],
  3: [
    "customer_gender",
    "customer_age",
    "customer_important_level",
    "customer_sum"
  ],
  4: [
    "customer_gender_g_day",
    "customer_age_g_day",
    "customer_important_level_g_day",
    "customer_sum_g_day"
  ],
  5: ["customer_important_level_g_hour", "customer_sum_g_hour"],
  6: ["avg_customer_stay_time"],
  7: ["avg_customer_stay_time_g_day"],
  8: ["heat_map"],
  9: ["rankinglist_stay_time_camera"],
  10: ["trace_count_g_camera", "stay_time_g_camera"],
  11: ["heat_map_origin_g_camera"]
}

export default {
  VISIT_SUM_G_DAY: "visit_sum_g_day",
  VISIT_GENDER_G_DAY: "visit_gender_g_day",
  VISIT_IMPORTANT_LEVEL_G_DAY: "visit_important_level_g_day",
  VISIT_AGE_G_DAY: "visit_age_g_day",
  VISIT_SUM_G_HOUR: "visit_sum_g_hour",
  CUSTOMER_SUM_G_HOUR: "customer_sum_g_hour",
  CUSTOMER_SUM_G_DAY: "customer_sum_g_day",
  CUSTOMER_GENDER_G_DAY: "customer_gender_g_day",
  CUSTOMER_IMPORTANT_LEVEL_G_DAY: "customer_important_level_g_day",
  CUSTOMER_AGE_G_DAY: "customer_age_g_day",
  AVG_CUSTOMER_STAY_TIME_G_DAY: "avg_customer_stay_time_g_day",
  IMPORTANT_LEVEL: "important_level",
  GENDER: "gender",
  CUSTOMER_AGE_GROUP: "age",
  // 热区相关
  // 店铺平面图热区信息
  ATTR_HEAT_MAP: "heat_map",
  // 店铺热区排行列表
  ATTR_RANKING_LIST: "rankinglist_stay_time_camera",
  // 摄像头热区信息
  ATTR_HEAT_MAP_ORIGIN_G_CAMERA: "heat_map_origin_g_camera",
  // 摄像头区域客流数
  ATTR_TRACE_COUNT_G_CAMERA: "trace_count_g_camera",
  // 摄像头区域总停留时长
  ATTR_STAY_TIME_G_CAMERA: "stay_time_g_camera",
  COOKIE_NAME,
  CHART,
  VISITOR_TABLE_COLUMN,
  get: key => {
    return contantMap[key]
  },
  MONTH_LIST,
  LOGIN_WARNING_COUNT
}
