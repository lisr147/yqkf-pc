<template>
  <div class="seal-area screen-wrap">
    <screen-header :navItemVisible="false"/>

    <!--标题-->
    <div class="caption" v-if="currSealArea.name">{{currSealArea.name}}</div>

    <!--图层-->
    <seal-map-layer
      ref="baseMapLayer"
      :isEditing="isEdit"
      :layer-ids="layerIds"
      @drawComplete="handleDrawComplete"
      @editStop="handleEditStop"
      @layerClicked="handelLayerClicked">
    </seal-map-layer>

    <!--模式切换-->
    <div class="seal-area-tab">
      <div class="seal-area-tab-item" v-for="item in list" :key="item.value" :class="{active:mode == item.value}" @click="switchMode(item)">
        {{item.label}}
      </div>
    </div>

    <!--区域统计信息面板-->
    <transition name="fade">
      <seal-area-detail @close="resetCurrSealArea" v-if="isDetailVisible" :areaAttribute="areaAttribute"></seal-area-detail>
    </transition>

    <!--编辑区域按钮-->
    <div class="area-opt" v-show="isEdit">
      <div class="btn" @click="backToAll" >返回</div>
      <div class="btn danger" @click="removeArea" v-show="currSealArea.id">删除</div>
      <div class="btn"  @click="popupForm">保存</div>

      <el-popover
        placement="top-start"
        popper-class="screen-popover"
        width="300"
        trigger="hover"
        content="">
        <p>1.点击区域可对当前区域进行编辑</p>
        <p>2.点击区域端点，并按Delete键可删除当前端点</p>
        <p>3.缩放区域时按住Shift键可以保持现有宽高比</p>
        <div slot="reference" class="btn" >帮助说明</div>
      </el-popover>

    </div>

    <div class="area-opt" v-show="addAble">
      <!--<el-popover-->
        <!--placement="top-start"-->
        <!--width="200"-->
        <!--trigger="hover"-->
        <!--content="点击开始绘制区域，双击鼠标左键结束绘制，并可以进行编辑">-->
        <div slot="reference" class="btn"  @click="addArea" >划设区域</div>
      <!--</el-popover>-->
    </div>

    <!--图例-->
    <map-legend
      @gridLayerSwitch="handleGridSwitch"
      @gotoLocation="handleGotoLocation"
      @clearLocation="handleClearLocation"
      @bgMapChange="handleByMapChange"
      @changeAreaType="handleChangeAreaType"
      :has-grid="false"
    ></map-legend>

    <!--区域详情-->
    <el-dialog
      title="基本信息"
      width="600px"
      :visible.sync="formVisible"
      class="screen-dialog"
      v-dialogDrag
    >
      <el-form  :rules="rules" ref="baseForm" :model="form" label-width="80px" >

        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型"  prop="type">
          <el-select v-model="form.type" placeholder="请选择区域类型">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in typeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属镇街" prop="town">
          <el-select v-model="form.town" placeholder="请选择所属镇街">
            <el-option
              :label="item"
              :value="item"
              :key="index"
              v-for="(item, index) in streetList"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积" >
          <el-input :value="parseInt(form.area)" readonly>
            <template slot="append">平方米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" >
          <el-input  type="textarea" placeholder="请输入描述内容"  v-model="form.remark" maxlength="1000" show-word-limit :autosize="{minRows:2, maxRows:6}" prop="remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveArea" type="primary" size="success">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--确诊人员图层过滤器-->
    <diagnose-filter @selectChange="updateDiagnoseLayer"/>

    <!--流调人员信息-->
    <dispatch-panel :id="dispatchId" v-if="isDispatchPanelVisible" @close="isDispatchPanelVisible=false"></dispatch-panel>

        <div v-if="clusterData" class="clusterData" :style="{left:clusterData.x+'px',top:clusterData.y+'px'}">
            <!-- {{clusterData}} -->
            <p v-for="item in clusterData.data" @click="openDetail(item)" :key="item.id">
                {{item.name}}
            </p>
        </div>
  </div>
</template>

<script>
  import ScreenHeader from "@/components/screen/ScreenHeader";
  import SealMapLayer from "./SealMapLayer";
  import SealAreaDetail from "./SealAreaDetail";
  import SealMapForm from "@/mixins/SealMapForm"

  import {stringfyPolygon} from '@/api/sealarea2.js'
  import MapLegend from "./MapLegend"

  import DiagnoseFilter from "./DiagnoseFilter"
  import DispatchPanel from "./Dispatch/DispatchPanel";

  import Watcher from "@/class/watcher";

  export default {
    name: "SealAreaIndex",
    components: {DispatchPanel, DiagnoseFilter, SealAreaDetail, SealMapLayer, ScreenHeader, MapLegend},
    data() {
      return {
        areaAttribute: null,
        list: [
          {label: '高/中风险区',value: 0},
          {label: '编辑模式', value: 1}
        ],
        streetList: [
          "南沙街",
          "黄阁镇",
          "东涌镇",
          "大岗镇",
          "榄核镇",
          "横沥镇",
          "万顷沙镇",
          "珠江街",
          "龙穴街",
        ],
        //声明所有图层id
        layerIds: [],

        //是否编辑区域中
        isDrawing: false,

        //封控管理区信息表单是否可见
        formVisible: false,

        //流调窗口是否可见
        isDispatchPanelVisible: false,
          dispatchId: null,
        clusterData:null
      }
    },
    mixins: [SealMapForm],
    computed: {
      mode:{
        set(newVal){
          this.$store.commit('common/SET_SEALAREA_MODE',newVal)
        },
        get(){
          return this.$store.state.common.sealareaMode
        }
      },
      currSealArea() {
        return this.$store.state.common.sealarea || {}
      },
      //是否显示区域统计信息
      isDetailVisible(){
        return this.mode == 0 && Object.keys(this.currSealArea).length > 0
      },
      isEdit(){
        //是否进入编辑模式
        return this.mode == 1 && Object.keys(this.currSealArea).length > 0
      },
      addAble(){
        return this.mode == 1 && !this.isDrawing && Object.keys(this.currSealArea).length == 0
      }
    },
    watch: {
      mode(val) {
        this.backToAll()
      },
      currSealArea(obj) {

        for (let key in this.form) {
          this.form[key] = obj[key]
        }
      }
    },
    created(){

      let arr = [
        {
          id: "boundary",
          visible: true,
        },
        {
          id: "seal-area2",
          visible: true
        },
        {
          id: "diagnose-trace",
          visible: true
        },
        {
          id: "dispatch-person",
          visible: true
        }
      ]

      //图层渲染排序
      arr.sort((a, b) => {
        return a.order - b.orders
      })

      this.layerIds = arr

    },
    mounted() {
      this.initWatcher()
    },
    methods: {

      initWatcher(){
        if (window['_watcher_voice']) {
          return
        }
        const ws = new Watcher({
          name: 'dispatchWatcher',
          type: 'voice',
          scope: this
        })

        ws.addListener((data)=>{
          this.updateDispatchModel(data)
        })
      },

      //更新流调信息模块
      updateDispatchModel(data) {
        const {
          dataId, //流调id
          fieldName, //字段名
          index, // 索引值，如果操作对象是数组，则更新索引值为index的成员
          type, // 信息簇 标识
        } = data

        switch(type){
          case 'map':
            //更新地图
            this.$refs['baseMapLayer'].refreshLayer({id: 'dispatch-person'})
            //todo: 更新位置?
            break;
          case "track":
            //核心轨迹 的数据特殊处理
            if (this.dispatchId !== dataId) {
              return
            }
            if (fieldName == 'hxgj') {
              const locustItem = JSON.parse(JSON.stringify(this.$store.state.dispatch.trackInfo.locus[index]))
              locustItem.locusYyWb.push({
                mediaInfoId: data.value.mediaInfoId,
                yyText: data.value.mediaInfoText,
                order: data.value.mediaInfoIndex
              })
              this.$store.commit('dispatch/SET_INFO_ITEM', {
                infoName: `trackInfo`,
                fieldName: 'locus',
                value: locustItem,//目标最终值
                index, //目标的索引值
                opt: 'update'
              })
            }
            break;
          default:
            //常规处理简单字段更新
            if (this.dispatchId !== dataId) {
              return
            }
            //更新语音
            if (data.value instanceof Object && data.value.mediaInfoId) {
              this.$store.commit('dispatch/SET_INFO_ITEM', {
                infoName: `${type}Info`,
                fieldName: `${fieldName}yywb`,
                value: {
                  mediaInfoId: data.value.mediaInfoId,
                  yyText: data.value.mediaInfoText,
                  order: data.value.mediaInfoIndex
                },
                opt: 'add'
              })
            } else {
              //更新变量
              this.$store.commit('dispatch/SET_INFO_ITEM', {
                infoName: `${type}Info`,
                fieldName: `${fieldName}`,
                value: data.value
              })
            }
            break;
        }

      },

      //切换模式
      switchMode(item){
        this.mode = item.value
      },

      resetCurrSealArea(){
        this.$store.commit('common/SET_CUR_SEALAREA', null)
      },

      //设置当前区域
      setCurrSealarea(attributes, target, goto = false) {
        this.areaAttribute = attributes;
        const {name} = attributes

        if (this.currSealArea.name == name) {
          return
        }

        //设定当前高风险区
        this.$store.commit('common/SET_CUR_SEALAREA', attributes)

        //定位到当前封控管理区
        if (goto) {
          this.$refs['baseMapLayer'].gotoLocation({target: target.graphic, zoom: 13})
        }

      },

      //更新确诊人员图层
      updateDiagnoseLayer(event) {
        const {ids} = event
        var filterCode = ''
        if (ids.length > 0) {
          filterCode = ids.map(v => {
            return `sfzhm = '${v}'`
          }).join(' OR ')
        } else {
          filterCode = 'id=NULL'
        }

        this.$refs['baseMapLayer'].filterDataInLayer({id: 'dispatch-person', filterCode})
        this.$refs['baseMapLayer'].filterDataInLayer({id: 'diagnose-trace', filterCode})
      },

      //处理图层点击事件
      async handelLayerClicked(params){
            console.log('图层点击事件')
            this.clusterData = null
            if (!params) {
                return
            }

            const { layerId, attributes, target,event } = params
        switch (layerId) {
          case "boundary":
            break;
          case "seal-area2":
            if (this.mode == 0) {
              //查看详情
              //判断类型是否为管控网格,不是才触发点击事件
              if(attributes.type!=='managewga'){
                this.setCurrSealarea(attributes, target)
              }
            } else if (this.mode == 1) {
              //编辑区域
              if (this.currSealArea.name) {
                return
              }
              this.setCurrSealarea(attributes, target)
              this.$refs['baseMapLayer'].addDrawFeature(target.graphic.geometry)
            }
            break;
            case "dispatch-person":
            // 聚合模式
                    if (attributes.clusterId) {
                        let layer = this.$refs.baseMapLayer.getLayerById('dispatch-person')
                        let layerView = await this.$refs.baseMapLayer.view.whenLayerView(layer)
                        let query = layerView.createQuery();
                        query.aggregateIds = [attributes.clusterId];
                        let res = await layerView.queryFeatures(query)
                            console.log('features', res,event)
                        this.clusterData = {}
                        this.clusterData.data    = res.features.map(v => {
                                return v.attributes
                        })
                        this.clusterData.x = event.x
                        this.clusterData.y = event.y
                        return
                    }

            this.dispatchId = attributes.id
            this.isDispatchPanelVisible = true
            break;
          default:
            break;
        }
      },

      handleDrawComplete(){
        this.addArea()
        this.isDrawing = false
      },

      async handleEditStop(){

        //重新获取多边形坐标和面积
        const {polygon, area} = await this.getPolygonData()
        this.form.polygon = polygon
        this.form.area = area
      },

      //创建一个矩形区域
      addArea() {
        this.$store.commit('common/SET_CUR_SEALAREA', {
          id: null,
          name: '新建区域',
          type: 'manage',
          remark: '',
          unitName: '',
          town: ''
        })
        this.$refs['baseMapLayer'].addDefaultFeature()
      },

      // 绘制区域
      // 绘制功能存在问题，得到的rings数据非闭合图形
      addDraw() {
        this.$refs['baseMapLayer'].initDraw()
        this.isDrawing = true
      },

      //删除
      removeArea() {

        this.$confirm('此操作将永久删除该区域,确定删除吗？', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //执行删除
          await this.handleRemoveArea()
          // 更新图层
          this.refreshData()
          this.backToAll()

        }).catch(err => {})
      },

      editBaseInfo() {
        this.formVisible = true
      },

      //保存
      async popupForm(){

        //获取多边形坐标和面积
        const {polygon, area} = await this.getPolygonData()
        if (area <= 0) {
          this.$message({
            message: '当前没有区域范围，请返回重新绘制',
            type: 'warning'
          })
          return
        }
        this.form.polygon = polygon
        this.form.area = area
        this.form.mapType = 'GD'

        //获取所属镇街
        // const towns = await this.getBelogsTowns()

        // if (towns.length !== 1) {
        //   this.$message({
        //     message: `高风险区域必须在1个镇街区域内,且不能跨镇街`,
        //     type: 'warning'
        //   })
        //   return
        // }

        // this.form.town = towns.join(',')

        this.formVisible = true

      },

      async saveArea(){

        const valid = await this.validForm()

        if (!valid) {
          this.$message({
            message: '请检查基本信息是否填写完整',
            type: 'warning'
          })
          return
        }

        //提交请求
        await this.handleSaveArea(this.form)
        // 更新图层
        this.refreshData()
        //返回默认布局
        this.backToAll()
      },

      //获取当前区域的多边形数据
      //如果当前区域为 中风险区区区,则需要减去其包含的高风险区
      //如果当前区域为 低风险区,则需要减去其包含的中风险区区区
      async getPolygonData() {

        const {type} = this.form

        //获取所有高风险区geometry
        const exitLayer = this.$refs['baseMapLayer'].getLayerById('seal-area2')
        const geometries = []
        const {features} = await exitLayer.queryFeatures()

        if (type == 'manage') {

          //获取当前所有高风险区
          features.forEach(item => {
            const {attributes, geometry} = item
            if (attributes.type == 'seal') {
              geometries.push(geometry)
            }
          })

        }else if(type == 'prevention'){

          //获取当前所有中风险区区区
          features.forEach(item => {
            const {attributes, geometry} = item
            if (attributes.type == 'manage') {
              geometries.push(geometry)
            }
          })

        }

        const {polygon, area} = this.$refs['baseMapLayer'].getDrawFeature({geometries})
        return {
          polygon: stringfyPolygon(polygon),
          area: area
        }

      },

      //获取当前绘制区域所在的镇街
      async getBelogsTowns(){

        //所有镇街多边形
        const boundaryLayer = this.$refs['baseMapLayer'].getLayerById('boundary')
        const {features} = await boundaryLayer.queryFeatures()

        const intersectArr = this.$refs['baseMapLayer'].getIntersectPolygon({features})
        return intersectArr.map(v=>v.name)
      },


      backToAll(){
        this.resetCurrSealArea()
        this.$refs['baseMapLayer'].clearDrawLayer()
        // this.$refs['baseMapLayer'].backToWhole()
        this.formVisible = false
      },

      refreshData() {
        this.$refs['baseMapLayer'].refreshLayer({id:'seal-area2'})
      },

      //处理网格图层显示状态
      handleGridSwitch({visible}) {
        this.$refs["baseMapLayer"].toggleOneLayer("grid", visible);
      },

      handleGotoLocation(event){
        this.$refs['baseMapLayer'].clearMarker()
        this.$refs['baseMapLayer'].gotoLocation(event)
      },

      handleClearLocation(){
        this.$refs['baseMapLayer'].clearMarker()
      },

      //触发底图切换
      handleByMapChange({ id }) {
        this.$refs["baseMapLayer"].switchByLayer(id);
      },

      handleChangeAreaType({data}){

        const arr = data.map(v=>{return `type = '${v.value}'`})
        const filterCode = arr.length > 0 ? arr.join(' OR ') : `type = 'none'`
        this.$refs['baseMapLayer'].filterDataInLayer({id: 'seal-area2', filterCode})
        },
          openDetail(item) {
                            this.dispatchId = item.id
                    this.isDispatchPanelVisible = true
    }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .seal-area {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #20326f;

    .caption{
      position: absolute;
      left: 50%;
      top: 90px;
      z-index: 1000;
      padding: .2em 0;
      min-width: 350px;
      max-width: 600px;
      transform: translateX(-50%);
      color: #fff;
      font-size: 30px;
      text-align: center;
      background: linear-gradient(90deg, rgba(0, 231, 255, 0) 0%, #00BACE 30%, #00B8C9 76%, rgba(0, 231, 255, 0) 100%);
    }

    &-tab{
      position: absolute;
      top: 5em;
      left: 3em;
      z-index: 9999;
      display: inline-block;
      width: 300px;

      &-item{
        display: inline-block;
        margin-left: -1px;
        padding: 8px 4px;
        padding-left: 30px;
        width: 38%;
        box-sizing: border-box;
        border: 1px solid #314f98;
        text-align: center;
        cursor: pointer;
        color: #fff;

        &:first-child{
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          background:  rgba(32, 50, 111, 0.8) url("~@/assets/image/sealArea/manage.svg") 10% center no-repeat;
        }

        &:last-child{
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          background: rgba(32, 50, 111, 0.8) url("~@/assets/image/sealArea/edit.svg") 16% center no-repeat;
        }

        &:hover{
          background-color: #345EF0;
        }

        &.active{
          background-color: #345EF0;
        }
      }
    }

    .area-opt{
      position: absolute;
      bottom: 3em;
      left: 50%;
      transform: translateX(-50%);
    }

    .fade-enter-active, .fade-leave-active {
      transition: all .3s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  .clusterData{
    position: fixed;
    background-color: rgba($color: #000000, $alpha: .7);
    color: #fff;
    padding: 5px;
    p{
        color:#fff;
        cursor: pointer;
    }
}
</style>
