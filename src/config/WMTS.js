// import SpatialReference from '@arcgis/core/geometry/SpatialReference'

export const WMTS_Layers = [
    {
        //底图配置
        //lang  可以通过zh_cn设置中文，en设置英文
        //style 地图类型控制，6卫星（st），7简图（st rd），8详图（不透明rd，透明图st）
        //scl    尺寸控制，1=256,2=512
        //ltype 线性控制，增加后，只对地图要素进行控制，没有文字注记，要素多少，是否透明

        title: '高德矢量图层',
        id: 'bg-black',
        effect: "sepia(100%) invert(90%) brightness(200%)",
        urlTemplate: "http://webst{subDomain}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}&scl=2&size=1",
        visible: false,
    },
    {
        title: '高德矢量图层(白)',
        id: 'bg-white',
        effect: null,
        urlTemplate: "http://webst{subDomain}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}&scl=2&size=1",
        visible: false,
    },
    {
        title: '卫星地图',
        id: 'bg-wx',
        effect: null,
        urlTemplate: "https://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}&scl=2",//高德
        visible: true
    },
    {
        title: '高清卫星地图',
        id: 'bg-gq',
        effect: null,
        urlTemplate: "https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}", //google地图
        visible: false
    }
]


export const GZ2000 = {
    // SpatialReference: new SpatialReference({
    //   wkt: `PROJCS["GUANGZHOU2000",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["false_easting",0.0],PARAMETER["false_northing",0.0],PARAMETER["central_meridian",113.28],PARAMETER["scale_factor",1.0],PARAMETER["latitude_of_origin",0.0],UNIT["Meter",1.0]]`
    // }),
    wkt: `PROJCS["GUANGZHOU2000",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.28],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]`
}

// WGS 84
export const WKID = {
    wkid: 4326
}

// google墨卡托
export const WKIDGoogle = { wkid: 3857 }