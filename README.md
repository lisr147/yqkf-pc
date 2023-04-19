# yqfk-pc-frontend

疫情防控-PC端

# 安装工程
npm i  --registry http://192.168.1.106:4873

# 测试环境

账号密码
admin/nsdn2021

## 大屏
http://develop.iot-cas.com:8081/yqfk/index.html

## 大屏端：
http://develop.iot-cas.com:8081/yqfk/index.html#/big/index

# 生产环境

账号密码
admin/DN1q2w3e!

## 大屏
http://dn.product.iot-cas.com:8081/yqfk/index.html#/big/index
## 后台
http://dn.product.iot-cas.com:8081/esso/login?service=http%3A%2F%2Fdn.product.iot-cas.com%3A8081%2Fyqfk%2Fcas_loginhttp://dn.product.iot-cas.com:8081/yqfk/index.html#/dataManage/import
## 移动端
志愿者http://dn.product.iot-cas.com:8081/myqfk/index.html#/login/index?vtype=zyz
## 移动端
社区卫生http://dn.product.iot-cas.com:8081/myqfk/index.html#/login/index


# 接口文档
http://develop.iot-cas.com:8081/yqfk/swagger-ui.html

# 业务流程介绍

## 创建一个图层

   这里只介绍公共的普通图层，即提供templateId就可以创建的地图图层。

   1.在setting.js中声明图层，如下所示，id为图层的前端唯一标识
   ```js
   const LAYER_DICT = {
     {label: '中高风险地区来粤返粤人员',id: 'dangerPeople',  templateId: 10058},
   }
   ```

   2.配置图层菜单项，如下所示将图层声明加入某个菜单项
   ```js
   getLayerMenu: function(){
       return[{
            label: '重点人群',
            children:[
               {
                 label: '中高风险地区来粤返粤人员', //显示中文名
                 id: 'dangerPeople',  //唯一标识
                 checked: false, //是否默认勾选
                 order: 2, //图层在地图中的叠加顺序
               },
            ]
       }]
   }
   ```
   3.配置图层的基本参数，决定了图层的展示形式，数据来源。

   图层一般通过mapData.js 的`getMapLayerData`方法携带参数templateId获取图层数据，可以使用如下的getData生成获取方法

   ```js
   mapLayers:[{
         id: 'dangerPeople',  //图层id
         title: '中高风险地区来粤返粤人员',
         layerType: 'point',  //图层的展示形式，point点 polyline线 polygon面
         showLabel: true, // 是否显示文字
         keyField: 'value', //显示文字取字段
         fields: [  //图层每个元素携带的额外属性
           {name: 'csmc', type: 'string'}
         ],
         renderer: createMapLayerRender({iconName: 'video'}),
         getData: createGetDataFn({title: '中高风险地区来粤返粤人员'})
   }]
   ```
   4.增加图层元素点击事件监听

   在index2.vue的地图事件监听`handelLayerClicked`中增加对新增图层的处理
   ```js
   handelLayerClicked({ layerId, attributes, event }){
        switch (layerId) {
            case "dangerPeople":
            //...
            break;
        }
   }
   ```

## 创建一种数据模板的录入页面

   1.从服务端人员处获取数据模板templateId


   2.在menuData.js中配置菜单项
   ```js
   let menuData = {
       zdrq: {
           name: '重点场所',
           dangerPeople: '中高风险地区来粤返粤人员'
       }
   export const templateId = {
       dangerPeople: 10033, //templateId
       }
   }
   ```

   3.在综合门户中配置功能权限

   在综合门户打开页面“系统管理 - 应用系统配置”，找到“疫情防控-功能定义”，仿照现有的例子添加功能和权限；

   4.配置个角色的权限

   在综合门户打开页面“角色管理”选择“疫情防控-GLY-配置权限”，将新增的功能权限和访问权限勾选；

   5.回到疫情防控系统的`#/dataManage/import`页面，监测左侧菜单是否更新

## 流调信息
    ### websocket数据格式说明
    ```
    {
      dataId: '',//必要，流调id
      type: '', //必要，用于区分信息簇 base:基本信息 track:核心轨迹 vaccination:疫苗接种 detection:近7天核酸情况 other:其他 map:地图
      fieldName: '',//目标的字段名
      index: 0, //索引值，如果操作目标是数组，则更新索引值为index的成员
      value: '',//目标变更的值 可能是字符串、数组或对象
    }
    ```
    ### 举例子
    1.推送 核心轨迹语音更新 消息
    ```
     {
      dataId: '',//流调id
      type: 'track',
      fieldName: 'hxgj',//核心轨迹
      index: 0, // 更新第一条
      value: {
        mediaInfoId: '',//语音文件id
        mediaInfoText: '',//语音识别文字
        mediaInfoIndex: 0,//语音索引值
      }
    }
    ```

   2.推送 基本信息字段更新 消息
    ```
     {
      dataId: '',//流调id
      type: 'base',
      fieldName: 'nl',//年龄
      index: null,
      value: '12岁' //更新的字段值
    }
    ```

    3.推送 疫苗接种情况更新 消息
    ```
    {
      dataId: '',//流调id
      type: 'vaccination',
      fieldName: 'ymjz',//字段名
      index: null, //index为整数，更新指定指端，index为null，则更新整个字段
      value: [{id, jzdw, ymmc, ymzc ...}]
    }
    ```

    4.推送 地图内容更新 消息
    ```
    {
      dataId: '',//流调id
      type: 'map',
      fieldName: 'lngLat', //字段名
      index:null,
      value: {longitude: 0, latitude: 0}
    }
    ```

   5.推送 照片更新 消息
    ```
    {
      dataId: '',//流调id
      type: 'other', //其他
      fieldName: 'qtzp', //字段名
      index: null,
      value: 'id1, id2, id3, id4, id5 '
    }
    ```

