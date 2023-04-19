import {
  getBaseInfo,
  getNucleicAcidResult as getNucleicAcid,
  getCoreLocus,
  getImageInfo,
  getEpidemicVaccinationResult as getVaccinationStatus,
  saveNucleicAcidStatus,
  saveVaccinationStatus,
  saveCoreLocus,
  getCodeScanning,
  getRelatedPersonnel
} from "@/api/epidemiologicalSurvey";
import { putTemplateData } from "@/api/common";

export const baseInfoFormRules = Object.freeze({
  // 基本信息
  xm: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
  ],
  sfzhm: [
    { required: true, message: "证件号码不能为空", trigger: "blur" },
    // {
    //   pattern:
    //     /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    //   message: "身份证号格式不正确",
    //   trigger: "blur",
    // },
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

export const epidemiologicalSurveyMaps = Object.freeze([
  {
    label: "基本信息",
    value: "baseInfo",
    api: getBaseInfo,
    saveApi: putTemplateData,
  },
  {
    label: "核心轨迹",
    value: "coreLocus",
    api: getCoreLocus,
    saveApi: saveCoreLocus,
  },
  {
    label: "疫苗接种情况",
    value: "vaccinationStatus",
    api: getVaccinationStatus,
    saveApi: saveVaccinationStatus,
  },
  {
    label: "近14日核酸情况",
    value: "nucleicAcidStatus",
    api: getNucleicAcid,
    saveApi: saveNucleicAcidStatus,
  },
  {
    label: "近14日扫码记录",
    value: "scanRecord",
    api: getCodeScanning,
    apiType: 'pages'
  },
  {
    label: "关联人员",
    value: "relationMember",
    api: getRelatedPersonnel,
    apiType: 'pages'
  },
  {
    label: "其他",
    value: "other",
    api: getImageInfo,
  },
]);

export const baseInfoFormTemplate = Object.freeze({
  xm: "",
  nl: "",
  xb: "",
  sfzhm: "",
  lxdh: "",
  gzdw: "",
  hjdz: "",
  xzz: "",
  zy: "",
  glsj: "",
});

export const coreLocusFormTemplate = Object.freeze({
  locus: [],
  photo: "",
});

export const currentTraceTemplate = Object.freeze({
  zdcs: [],
  esId: "",
  locusYyWb: [],
  locusDate: "",
  locusYy: "",
  locus: null,
  id: "",
});

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
  jcdw: "核酸采样地点",
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
    label: "证件号码",
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
    label: "常住地址",
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
  ],
  sfzhm: [
    { required: true, message: "证件号码不能为空", trigger: "blur" },
    // {
    //   pattern:
    //     /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    //   message: "身份证号格式不正确",
    //   trigger: "blur",
    // },
  ],
  lxfs: [
    {
      required: true,
      message: "请输入联系电话",
      trigger: "blur",
    },
  ],
  rylx: [
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

export const vaccinationStatusFormTemplate = Object.freeze({
  data: [],
  sfzhm: "",
  xm: "",
  ymzp: "",
});

export const nucleicAcidStatusFormTemplate = Object.freeze({
  data: [],
  sfzhm: "",
  xm: "",
  hszp: "",
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
  glsjId: [
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
  zjlx:[
    { required: true, message: "请选择证件类型", trigger: "change" }
  ],
  sfzhm: [
    { required: true, message: "证件号码不能为空", trigger: "blur" },
    // {
    //   pattern:
    //     /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    //   message: "身份证号格式不正确",
    //   trigger: "blur",
    // },
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

export const epidemiologicalSurveyTableKeys = Object.freeze([
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
    id: "bllx",
    label: "病例类型",
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
    label: "证件号码",
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
    id: "ymjzzc",
    label: "疫苗接种针次",
  },
  {
    id: "hscs",
    label: "近14日核酸情况",
    width: "150",
  },
  {
    id: "zjychscysj",
    label: "最近一次核酸采样时间",
    width: "180",
  },
  {
    id: "zjychsjcsj",
    label: "最近一次核酸检测时间",
    width: "180",
  },
  {
    id: "zjychsjcjg",
    label: "最近一次核酸检测结果",
    width: "180",
  },
  {
    id: "sdrylx",
    label: "哨点人员类型",
    width: "150",
  },
  {
    id: "smcssl",
    label: "近14日扫码场所",
    width: "130",
  },
  {
    id: "fxrywz",
    label: "当前位置",
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
]);

export const statusArray = Object.freeze([
  "全部",
  "流调未开始",
  "流调进行中",
  "流调已结束",
]);

export const epidemiologicalSurveyTabs = Object.freeze([
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
]);

export const findDuplicateTableKeys = Object.freeze([
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
    label: "证件号码",
  },
  {
    id: "nl",
    label: "年龄",
  },
  {
    id: "xb",
    label: "性别",
  },
]);


export const addKeyPlaceFormTemplate = Object.freeze({
  rydtos: [
    {
      xm: "",
      lxfs: "",
      sfzhm: "",
      rylx: "",
    },
  ],
  csmc: "",
  csdz: "",
  datetimerange: [],
  hdsj: "",
  gjid: "",
  ldId: "",
});

export const addPositivePersonFormTemplate = Object.freeze({
  glsjId: "",
  xm: "",
  lxdh: "",
  sfzhm: "",
});
