<template>
  <div class="data-desc">
    <table>
      <thead>
        <tr>
          <th width="40">序号</th>
          <th width="100">数据分类</th>
          <th>数据子类</th>
          <th>数据来源单位</th>
          <th width="120">对接方式</th>
          <th width="70">更新频率</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="(item,index) in dataList">
            <td>{{index+1}}</td>
            <td v-if="item.rowspan>0" :rowspan="item.rowspan">{{item.type1}}</td>
            <td>{{item.type2}}</td>
            <td>{{item.source}}</td>
            <td>{{item.method}}</td>
            <td>{{item.freq}}</td>
          </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'DataDescription',
    components: {},
    data() {
      return {
        dataList:[
          { rowspan:0, type1:'重点人群数据',type2:'中高风险地区来粤返粤人员核查情况(总表)',source:'市公安局南沙区分局、各镇街', method:'自动统计',freq:'每天'},
          { rowspan:0, type1:'重点人群数据',type2:'中高风险地区来粤返粤人员核查情况(当天清零表)',source:'市公安局南沙区分局、各镇街', method:'自动统计',freq:'每天'},
          { rowspan:0, type1:'重点人群数据',type2:'中高风险地区来粤返粤人员明细',source:'市公安局南沙区分局、各镇街', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点人群数据',type2:'高风险岗位人员',source:'区商务局、口岸办、广州港务局海港分局、区市场监管局、区交通运输局、区卫健局、区委政法委', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点人群数据',type2:'密接、次密接人员数据',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点人群数据',type2:'密接、次密接人员去向定位',source:'区卫生健康局', method:'Excel导入',freq:'实时更新'},
          { rowspan:0, type1:'重点人群数据',type2:'特殊人群统计',source:'区委政法委（网格中心）、区民政局、各镇街', method:'自动统计',freq:'每月'},
          { rowspan:0, type1:'重点人群数据',type2:'特殊人群明细',source:'区委政法委（网格中心）、区民政局、各镇街', method:'区共享平台对接',freq:'每月'},
          { rowspan:0, type1:'重点人群数据',type2:'红黄码人员数据',source:'区政数局', method:'区共享平台对接',freq:'每天'},

          { rowspan:0, type1:'哨点人群',type2:'商超工作人员',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'口岸企业工作人员',source:'区口岸办', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'餐饮行业工作人员',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'非星级酒店（工作人员）',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'非星级酒店（旅客）',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'货车司机哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'工业企业哨点人员',source:'区工信局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'农贸市场工作人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'服装行业工作人员',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'渔业渔民工作人员',source:'区农村农业局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'工地集中居住哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'公共交通哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'养老机构哨点人员',source:'区民政局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'环卫点哨点人员',source:'区城市管理局、镇（街）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'废品站哨点人员',source:'镇（街）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'外卖企业哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'小虎化工园区哨点人员',source:'区化工应急管理中心', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'文广旅哨点人员',source:'区文广旅', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'医疗结构（重点岗位）哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'医疗机构（一般岗位）哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'托育机构哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'母婴保健哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'精神卫生机构哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'美容按摩院哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'沐足桑拿哨点人员',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'药店哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'酒吧哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'其他餐饮机构哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'进口冷链食品生产单位哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'冷库企业哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'无冷库哨点人员',source:'区市场监管局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'A级景区哨点人员',source:'区文广旅', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'星级酒店哨点人员',source:'区文广旅', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'网吧KTV哨点人员',source:'区文广旅', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'室内健身场所哨点人员',source:'区文广旅', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'图书馆哨点人员',source:'区文广旅', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'工地外分散居住哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'重点物流场所哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'涉省外货运作业场所哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'国际邮件作业点哨点人员',source:'区住建局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'保安哨点人员',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'中小学（幼儿园）哨点人员',source:'区教育局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'课外机构哨点人员',source:'区教育局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'技工院校哨点人员',source:'区人力资源社会保障局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'民办职业培训机构哨点人员',source:'区人力资源社会保障局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'监管场所哨点人员',source:'区公安分局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'棋牌室麻将馆哨点人员',source:'区公安分局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'垃圾收运哨点人员',source:'区城市管理局、镇（街）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'宗教活动场所哨点人员',source:'区民宗局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'康园工疗站哨点人员',source:'区残联', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'城中村哨点人员',source:'镇（街）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'哨点人群',type2:'一线工作人员',source:'区防控办', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'哨点人群',type2:'人员核酸和疫苗接种匹配',source:'各用户', method:'Excel导入',freq:'每天'},

          { rowspan:0, type1:'重点场所数据',type2:'隔离酒店',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点场所数据',type2:'隔离酒店人员信息',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点场所数据',type2:'常规核酸采样点',source:'区卫生健康局', method:'Excel导入',freq:'每周'},
          { rowspan:0, type1:'重点场所数据',type2:'大规模核酸采样点数据',source:'区卫生健康局', method:'Excel导入',freq:'每周'},
          // { rowspan:0, type1:'重点场所数据',type2:'核酸采样点数据',source:'区卫生健康局', method:'Excel导入',freq:'每周'},
          { rowspan:0, type1:'重点场所数据',type2:'道路出入口数据',source:'区交警大队、区住房和城乡建设局（区交通运输局）、各镇街', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'公共场所数据',source:'区政数局、市公安局南沙区分局', method:'自动统计',freq:'每小时'},
          { rowspan:0, type1:'重点场所数据',type2:'冷链仓库数据',source:'区市场监管局', method:'Excel导入',freq:'每月'},
          { rowspan:0, type1:'重点场所数据',type2:'冷链仓库工作人员明细',source:'区市场监管局', method:'Excel导入',freq:'每月'},
          { rowspan:0, type1:'重点场所数据',type2:'跨境司机作业点数据',source:'区商务局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点场所数据',type2:'跨境司机明细',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点场所数据',type2:'出入境口岸数据',source:'区口岸办', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点场所数据',type2:'学校涉疫人员统计',source:'区教育局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'重点场所数据',type2:'国际进口邮件快件处理场所',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'国际进口邮件快件处理场所人员明细',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'进口原材料企业数据',source:'区工业和信息化信局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'进口原材料企业人员明细',source:'区工业和信息化信局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'确诊人员到过场所',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'口岸企业',source:'区口岸办', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'非星级酒店',source:'区市场监督管理局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'餐饮',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'出入境企业',source:'区口岸办', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'物流园区',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'工业园区',source:'区工业和信息化局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'农贸市场',source:'区市场监督管理局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'服装行业',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'重点场所数据',type2:'渔业渔民',source:'区农村农业局', method:'Excel导入',freq:'不定期更新'},
          // { rowspan:0, type1:'重点场所数据',type2:'穗康扫码通行记录',source:'区工信局', method:'系统对接',freq:'每小时'},
          // { rowspan:0, type1:'重点场所数据',type2:'公安扫码通行记录',source:'区公安局', method:'系统对接',freq:'每小时'},

          { rowspan:0, type1:'物资保障数据',type2:'医院数据',source:'区卫生健康局', method:'Excel导入',freq:'每月'},
          { rowspan:0, type1:'物资保障数据',type2:'区医疗救治转运专班负压车信息',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'配套医护人员排班表',source:'区卫生健康局', method:'Excel导入',freq:'每半月'},
          { rowspan:0, type1:'物资保障数据',type2:'专家会诊排班',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'药店数据',source:'区市场监管局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'购药记录数据',source:'区市场监管局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'购药记录排查情况明细',source:'区市场监管局', method:'自动统计',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'肉菜市场数据',source:'区市场监管局', method:'Excel导入',freq:'每月'},
          { rowspan:0, type1:'物资保障数据',type2:'商超数据',source:'区商务局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'水产品生产企业数据',source:'区农业农村局', method:'Excel导入',freq:'每周'},
          { rowspan:0, type1:'物资保障数据',type2:'防疫物资生产企业数据',source:'区工业和信息化局', method:'Excel导入',freq:'每月'},
          { rowspan:0, type1:'物资保障数据',type2:'畜禽生产企业数据',source:'区农业农村局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'运输企业数据',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'物资保障数据',type2:'建筑项目数据',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'物资保障数据',type2:'负压车辆数据',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'物资保障数据',type2:'政府物资储备数据',source:'区发改局', method:'Excel导入',freq:'每周'},
          { rowspan:0, type1:'物资保障数据',type2:'物流中转仓库数据',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'每月'},
          { rowspan:0, type1:'物资保障数据',type2:'物流中转仓库工作人员明细',source:'区住房和城乡建设局（区交通运输局）', method:'Excel导入',freq:'每月'},

          { rowspan:0, type1:'人力保障数据',type2:'物资配送人员数据',source:'区商务局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'人力保障数据',type2:'志愿者人员数据',source:'区民政局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'人力保障数据',type2:'志愿者机构',source:'区民政局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'人力保障数据',type2:'三人小组数据',source:'区委政法委（网格中心）', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'人力保障数据',type2:'全员核酸检测小组数据',source:'区卫生健康局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'人力保障数据',type2:'安保力量数据',source:'市公安局南沙分局', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'党组织数据',type2:'网格党组织数据',source:'区委组织部', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'党组织数据',type2:'挂点支援镇（街）安排表',source:'区委组织部', method:'Excel导入',freq:'不定期更新'},
          { rowspan:0, type1:'基础人口数据',type2:'实有人口（户籍人口、流动人口）',source:'区委政法委（网格中心）', method:'区共享平台对接',freq:'每天'},

          { rowspan:0, type1:'疫苗接种数据',type2:'疫苗接种数据',source:'市卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'疫苗接种数据',type2:'疫苗接种每日统计',source:'区卫生健康局', method:'Excel导入',freq:'每天'},
          { rowspan:0, type1:'疫苗接种数据',type2:'疫苗接种每日全市排名情况',source:'区卫生健康局', method:'Excel导入',freq:'每天'},

          { rowspan:0, type1:'核酸检测数据',type2:'核酸检测数据',source:'区卫生健康局', method:'区共享平台对接',freq:'每天'},
          { rowspan:0, type1:'网格数据',type2:'网格分布数据',source:'区委政法委（网格中心）', method:'区共享平台对接',freq:'每月'},
          { rowspan:0, type1:'涉疫地区来南沙人员 ',type2:'涉疫地区来南沙人员',source:'移动运营商', method:'移动运营平台对接',freq:'实时'},

          { rowspan:0, type1:'AI智能分析 ',type2:'AI智能分析大屏',source:'云从科技', method:'云从科技平台对接',freq:'实时'},
          { rowspan:0, type1:'AI智能分析 ',type2:'AI智能分析后台',source:'云从科技', method:'云从科技平台对接',freq:'实时'},

          { rowspan:0, type1:'实时视频',type2:'隔离酒店视频',source:'区卫生健康局', method:'广州市集中隔离场所精准管控系统接入',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'冷链仓库视频',source:'区市场监管局', method:'萤石云平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'跨境司机作业点视频',source:'区政数局', method:'电信运营商视频平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'常规核酸采样点视频',source:'区政数局', method:'移动运营商视频平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'大规模核酸采样点视频',source:'区政数局', method:'移动运营商视频平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'药店视频',source:'区市场监管局', method:'萤石云平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'学校视频',source:'区教育局', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'市城管云视频',source:'区政数局', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'工地视频',source:'区住房和城乡建设局（区交通运输局）', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'养老院视频',source:'区民政局', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'工业企业视频',source:'区工信局', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'公共场所',source:'市城管云', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'精神卫生机构',source:'区民政局', method:'移动运营商视频平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'母婴服务机构',source:'区民政局', method:'移动运营商视频平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'康复机构',source:'区民政局', method:'移动运营商视频平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'实时视频',type2:'核酸监测点周边',source:'市城管云', method:'区视频共享平台对接',freq:'不定期更新'},
          // { rowspan:0, type1:'实时视频',type2:'月子中心视频',source:'区民政局', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'通行记录',type2:'穗康扫码通行记录',source:'区政数局', method:'区视频共享平台对接',freq:'不定期更新'},
          { rowspan:0, type1:'通行记录',type2:'公安扫码通行记录',source:'市公安局南沙分局', method:'区视频共享平台对接',freq:'不定期更新'},
        ]
      }
    },
    mounted() {
      this.fixData()
    },
    methods: {
      fixData(){
        let temp, idx = 0, count = 0
        this.dataList.forEach((item, index) => {
          const {type1} = item
          if (temp !== type1) {
            this.dataList[idx].rowspan = count
            temp = type1
            idx = index
            count = 1
          }else{
            count++
          }
        })
        this.dataList[idx].rowspan = count
        console.log('数据说明')
        console.table(this.dataList)

      }
    }
  }
</script>

<style lang="scss" scoped>
.data-desc{
  table{
    border-collapse: collapse;
    th{
      background-color: #1b398e;
    }
    th,td{
      padding: 8px;
      border: 1px solid #00b9f2;
      color: #fff;
      text-align: left;
    }
  }
}
</style>
