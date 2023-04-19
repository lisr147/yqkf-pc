export const vaccinationFieldMap = Object.freeze({
  jmc: "厂家名称",
  jzdw: "接种单位",
  jzsj: "接种时间",
  ymmc: "疫苗名称",
  ymph: "批号",
  ymzc: "针次",
});

export const nucleicAcidMap = Object.freeze({
  cyrq: "核酸采样时间",
  jcdw: "核酸检测机构",
  jcjg: "核酸检测结果",
  jcsj: "核酸检测时间",
});

export const baseInfoFormKeys = Object.freeze([
  {
    label: "姓名",
    value: "xm",
    voiceKey: "xmyy",
  },
  {
    label: "年龄",
    value: "nl",
    voiceKey: "nlyy",
  },
  {
    label: "性别",
    value: "xb",
    voiceKey: "xbyy",
  },
  {
    label: "身份证号码",
    value: "sfzhm",
    voiceKey: "sfzhmyy",
  },
  {
    label: "联系电话",
    value: "lxdh",
    voiceKey: "lxdhyy",
  },
  {
    label: "工作单位",
    value: "gzdw",
    voiceKey: "gzdwyy",
  },
  {
    label: "户籍地址",
    value: "hjdz",
    voiceKey: "hjdzyy",
  },
  {
    label: "现住址",
    value: "xzz",
    voiceKey: "xzzyy",
  },
  {
    label: "职业",
    value: "zy",
    voiceKey: "zyyy",
  },
  {
    label: "当前位置",
    value: "lnglat",
  },
]);

export const addKeyPlaceFormKeys = Object.freeze({
  场所名称: "csmc",
  场所地址: "csdz",
  活动时间: "hdsj",
  密接人员: "mjry",
  次密接人员: "cmjry",
  重点人群: "zdrq",
});

export const peopleRules = Object.freeze({
  xm: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
    {
      required: true,
      message: "请输入姓名",
      trigger: "change",
    },
  ],
  sfzhm: [
    {
      required: true,
      message: "请输入身份证号码",
      trigger: "blur",
    },
    {
      required: true,
      message: "请输入身份证号码",
      trigger: "change",
    },
  ],
  lxfs: [
    {
      required: true,
      message: "请输入联系电话",
      trigger: "blur",
    },
    {
      required: true,
      message: "请输入联系电话",
      trigger: "change",
    },
  ],
  rylx: [
    {
      required: true,
      message: "请选择人员类型",
      trigger: "blur",
    },
    {
      required: true,
      message: "请选择人员类型",
      trigger: "change",
    },
  ],
});

export const addKeyPlaceFormRules = Object.freeze({
  csmc: [
    {
      required: true,
      message: "请输入场所名称",
      trigger: "blur",
    },
    {
      required: true,
      message: "请输入场所名称",
      trigger: "change",
    },
  ],
  csdz: [
    {
      required: true,
      message: "请输入场所地址",
      trigger: "blur",
    },
    {
      required: true,
      message: "请输入场所地址",
      trigger: "change",
    },
  ],
  datetimerange: [
    {
      required: true,
      message: "请选择活动时间",
      trigger: "blur",
    },
    {
      required: true,
      message: "请选择活动时间",
      trigger: "change",
    },
  ],
});

export const vaccinationStatusTemplate = Object.freeze({
  cjmc: "",
  jzdw: "",
  jzsj: "",
  ymmc: "",
  ymph: "",
  ymzc: "",
  addTag: true,
  isDeleted: false,
});

export const nucleicAcidStatusTemplate = Object.freeze({
  cyrq: "",
  jcdw: "",
  jcjg: "",
  jcsj: "",
  isDeleted: false,
  addTag: true,
});

export const addPersonRules = Object.freeze({
  glsj: [
    {
      required: true,
      message: "请选择关联事件",
      trigger: "change",
    },
  ],
  xm: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
  ],
  glbl: [
    {
      required: true,
      message: "关联病例不能为空",
      trigger: "blur",
    },
  ],
  keyPlace: [
    {
      required: true,
      message: "重点场所不能为空",
      trigger: "change",
    },
  ],
  sfzhm: [
    { required: true, message: "身份证号码不能为空", trigger: "blur" },
    {
      pattern:
        /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: "身份证号格式不正确",
      trigger: "blur",
    },
  ],
  lxdh: [
    { required: true, message: "请输入电话号码", trigger: "blur" },
    {
      pattern: /^1[23456789]\d{9}$/,
      message: "电话号码格式不对",
      trigger: "blur",
    },
  ],
});

export const epidemiologicalSurveyTableKeys = [
  {
    id: "index",
    label: "序号",
    allways: true,
  },
  {
    id: "glsj",
    label: "关联事件",
  },
  {
    id: "rylb",
    label: "人员类别",
  },
  {
    id: "glbl",
    label: "关联病例",
  },
  {
    id: "xm",
    label: "姓名",
    width: "100",
  },
  {
    id: "lxdh",
    label: "联系电话",
  },
  {
    id: "sfzhm",
    label: "身份证号码",
  },
  {
    id: "nl",
    label: "年龄",
  },
  {
    id: "xb",
    label: "性别",
  },
  {
    id: "ymjzqk",
    label: "疫苗接种情况",
  },
  {
    id: "hsqk",
    label: "近7日核酸情况",
    width: "120",
  },
  {
    id: "fxrywz",
    label: "发现人员位置",
    width: "120",
  },
  {
    id: "xczgjr",
    label: "现场组跟进人",
    width: "120",
  },
  {
    id: "xczgjrlxfs",
    label: "现场组跟进人联系方式",
    width: "170",
  },
  {
    id: "zt",
    label: "状态",
  },
  {
    id: "finishTime",
    label: "完成时间",
  },
  {
    id: "dxfszt",
    label: "短信发送状态",
    width: "120",
  },
];

export const statusArray = Object.freeze([
  "全部",
  "流调未开始",
  "流调进行中",
  "流调已结束",
]);

export const epidemiologicalSurveyTabs = [
  {
    label: "全部",
    value: "全部",
    extra: "",
  },
  {
    label: "流调未开始",
    value: "流调未开始",
    extra: "",
  },
  {
    label: "流调进行中",
    value: "流调进行中",
    extra: "",
  },
  {
    label: "流调已结束",
    value: "流调已结束",
    extra: "",
  },
];

export const findDuplicateTableKeys = [
  {
    id: "index",
    label: "序号",
    allways: true,
  },
  {
    id: "glsj",
    label: "关联事件",
  },
  {
    id: "rylb",
    label: "人员类别",
  },
  {
    id: "xm",
    label: "姓名",
  },
  {
    id: "sfzhm",
    label: "身份证号码",
  },
  {
    id: "nl",
    label: "年龄",
  },
  {
    id: "xb",
    label: "性别",
  },
];
