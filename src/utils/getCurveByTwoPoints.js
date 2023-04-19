/**
 * 计算两个经纬度坐标点之间的曲线坐标
 * @param {*} latlng1 原点坐标
 * @param {*} latlng2 终点坐标
 * @param {*} npoints 曲线坐标点数量，默认100
 * @param {*} israndom 弯曲程度是否随机
 * @returns
 */
export function getCurveByTwoPoints(latlng1, latlng2, npoints = 100, israndom = true) {
    if (!latlng1 || !latlng2) {
        return null
    }
    // B1 B2 B3使用的是二阶贝塞尔曲线的函数表达式
    // B_{2}(t) = (1 - t)^2P_0 + 2t(1 - t)P_1 + t^2P_2 , t\in[0, 1]
    // P_0为起始点  P_2为终止点  P_1为控制点， 选好的控制点之后，两点连线的曲线就出来了
    const B1 = function (x) {
        return 1 - 2 * x + x * x
    };
    const B2 = function (x) {
        return 2 * x - 2 * x * x
    };
    const B3 = function (x) {
        return x * x
    };
    const curveCoordinates = [];
    // count控制两点之间的数量
    let t, h, h2, lat3, lng3, t2;
    let inc = 0;

    // 将经纬度全部转化为固定格式Float类型的数据
    let lng1 = parseFloat(latlng1[0]);
    let lng2 = parseFloat(latlng2[0]);
    let lat1 = parseFloat(latlng1[1]);
    let lat2 = parseFloat(latlng2[1]);

    // 经度为-180 到 180度，这里将经度差取小于180度以内的，表示一个半球之间
    if (lng2 > lng1) {
        if (parseFloat(lng2 - lng1) > 180) {
            if (lng1 < 0) {
                lng1 = parseFloat(180 + 180 + lng1)
            }
        }
    }
    if (lng1 > lng2) {
        if (parseFloat(lng1 - lng2) > 180) {
            if (lng2 < 0) {
                lng2 = parseFloat(180 + 180 + lng2)
            }
        }
    }

    // t表示两点之间的角度， h表示两点之间的距离
    if (lat2 == lat1) {
        t = 0;
        h = lng1 - lng2
    } else {
        if (lng2 == lng1) {
            t = Math.PI / 2;
            h = lat1 - lat2
        } else {
            t = Math.atan((lat2 - lat1) / (lng2 - lng1));
            h = (lat2 - lat1) / Math.sin(t)
        }
    }
    // t2作用是控制 PI/5 的偏移量，因为经纬度不是1：1的坐标轴，这里不能用严格的中垂线去获取中垂线上的点，这里使用PI/5的偏移量来控制
    // 测试的时候最大用到 PI/4 才能使得曲线不变形，可以在0 - PI/4来控制弧度
    const level = israndom ? Math.floor(Math.random() * 10) : 0
    t2 = (t + (Math.PI / (4 + level)))
    h2 = h / 2;
    // 计算控制点的经纬度，由起始点添加偏移量
    lng3 = h2 * Math.cos(t2) + lng1;
    lat3 = h2 * Math.sin(t2) + lat1;
    // 计算曲线上的点
    for (let i = 0; i <= npoints; i++) {
        curveCoordinates.push([
            (lng1 * B1(inc) + lng3 * B2(inc)) + lng2 * B3(inc),
            (lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc))
        ]);
        inc += (1 / npoints)
    }
    return curveCoordinates
}