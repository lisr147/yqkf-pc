export function adorn({ code, option, updateTime }) {
  switch (code) {
    //去过荔湾人数占比
    case "gotoLwPercent":
      option.color = ["#f8951e", "#29b0ef"];
      Object.assign(option.series[0], {
        name: "数据占比",
        type: "pie",
        radius: ["0%", "60%"],
        center: ["50%", "55%"],
        label: {
          formatter: "{b}\n{c}, {d}%",
          position: "inside",
          lineHeight: 18
        }
      });
      Object.assign(option.legend, {
        top: "15%"
      });

      option.title = [
        {
          top: "3%",
          left: "2%",
          text: option.title.text,
          textStyle: {
            fontSize: 14
          }
        },
        {
          subtext: `填报总人数 ${option.title.subtext}`,
          left: "center",
          bottom: "3%",
          textAlign: "auto",
          subtextStyle: {
            // color: "#333",
            fontSize: 14
          }
        }
      ];
      break;
    //到过荔湾区各区域分布
    case "lwAreaNum":
      option.color = ["#29b0ef"];
      Object.assign(option.grid, {
        top: "14%",
        right: "5%",
        left: "1%"
      });
      option.series.forEach(item => {
        item.label = {
          show: true,
          position: "right"
        };
      });
      option.legend.show = false;
      option.xAxis.minInterval = 10;
      option.xAxis[0].axisLabel = {
        rotate: -20
      };
      option.tooltip.formatter = `{b}: {c}人`;
      break;
    //运营商统计
    case "yysRsBar":
      option.color = ["#29b0ef", "#f8951e"];
      option.series.forEach(item => {
        item.label = {
          show: true,
          position: "top"
        };
      });
      option.legend = {
        top: " 11%",
        data: ["填报总人数", "去过荔湾人数"]
      };
      option.tooltip.formatter = `{b}<br/>{a0}: {c0}人<br/>{a1}: {c1}人`;
      break;
    //到荔湾人员镇街7天核酸检测情况
    case "toLWzj7dayHsjc":
      option.color = ["#29b0ef", "#f8951e"];
    //7天内做核酸检测统计
    case "zj7dayHsjc":
      let [s1, s2] = option.series;
      const arr = s1.data.map((val, index) => {
        let total = val + s2.data[index];
        return {
          total,
          v1: val,
          v2: s2.data[index]
        };
      });
      option.tooltip.formatter = function(item) {
        const { v1, v2, total } = arr[item[0].dataIndex];
        const [s1, s2] = item;
        if (s2) {
          return `${item[0].name}: ${total}人
                <br/>${item[0].seriesName}: ${v1}人
                <br/>${item[1].seriesName}: ${v2}人`;
        } else if (s1) {
          return `${item[0].name}: ${total}人
                <br/>${item[0].seriesName}: ${v1}人`;
        }
      };

      s1.label = { show: false };
      // s1.barWidth = '60%'
      s2.label = {
        show: true,
        position: "right",
        formatter({ dataIndex }) {
          const { v1, v2 } = arr[dataIndex];
          return `{a|${v1}}` + `\n` + `${v2}`;
        },
        rich: {
          a: {
            color: "#29b0ef"
          }
        }
      };

      Object.assign(option.legend, {
        top: " 11%"
      });
      Object.assign(option.grid, {
        right: "10%"
      });
      break;
    //入境入港船只统计
    case "rjczcy":
    //入港入港船员统计
    case "rgczcy":
      option.color = ["#6172F0", "#36C9AF"];
      option.series.forEach(item => {
        item.label = {
          show: true,
          position: "top"
        };
      });
      option.tooltip = {
        show: true,
        trigger: "axis"
      };

      option.title = [
        {
          top: "3%",
          left: "2%",
          text: option.title.text,
          textStyle: {
            fontSize: 14
          }
        },
        {
          subtext: `更新时间:${updateTime}`,
          left: "2%",
          bottom: "0%",
          textAlign: "auto"
        }
      ];

      option.grid = {
        bottom: "8%",
        left: "4%",
        right: "4%",
        top: "24%",
        containLabel: true
      };

      option.tooltip.formatter = function(item) {
        const unit = code == "rjczcy" ? "艘" : "人";
        const [s1, s2] = item;
        if (s2) {
          return `${s1.seriesName}: ${s1.value}${unit}
           <br/>${s2.seriesName}: ${s2.value}${unit}`;
        } else if (s1) {
          return `${s1.seriesName}: ${s1.value}${unit}`;
        }
      };

      Object.assign(option.legend, {
        top: "11%"
      });

      break;
    // 去过荔湾区人员核酸检测占比
    case "LwHsjcPie":
      option.color = ["#49B04C", "#E8A12E"];
      option.legend = {
        top: "35%",
        right: "0%",
        orient: "vertical",
        textStyle: {
          fontSize: 14,
          lineHeight: 20
        }
      };
      Object.assign(option.series[0], {
        // name: "数据占比",
        radius: ["35%", "50%"],
        center: ["30%", "50%"],
        label: {
          show: false,
          position: "center",
          formatter: "{b}\n{c}\n{d}%"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            lineHeight: 15,
            rich: {
              a: {},
              b: {}
            }
          }
        }
      });
      option.title = [
        {
          top: "3%",
          left: "2%",
          text: option.title.text,
          textStyle: {
            fontSize: 14
          }
        },
        {
          subtext: `(5月9日~5月30日)`,
          top: "10%",
          left: "2%",
          textAlign: "auto",
          subtextStyle: {
            color: "#333",
            fontSize: 14
          }
        },
        {
          subtext: `总人数：{a|${option.title.subtext}}人`,
          right: "5%",
          top: "10%",
          textAlign: "auto",
          subtextStyle: {
            color: "#333",
            fontSize: 14,
            rich: {
              a: {
                color: "#2A44A6",
                fontSize: 20,
                fontWeight: "bold"
              }
            }
          }
        },
        {
          subtext: `更新时间：${option.updateTime}`,
          bottom: "5%",
          left: "2%",
          textAlign: "auto",
          subtextStyle: {
            color: "#999",
            fontSize: 12
          }
        }
      ];
      break;
    // 去过荔湾区近7天未做核酸检测每日人数
    case "near7DayLwNotHS":
      option.color = ["#E8A12E"];
      option.grid = {
        top: "30%",
        left: "5%",
        containLabel: true
      };
      Object.assign(option.xAxis[0], {
        axisLine: {
          // lineStyle: { color: "#999" }
        }
      });
      Object.assign(option.yAxis[0], {
        axisLine: {
          // lineStyle: { color: "#999" }
        }
      });
      option.title = [
        {
          top: "3%",
          left: "2%",
          text: `${option.title.text.split("（")[0]}\n{a|（${
            option.title.text.split("（")[1]
          }
          }`,
          textStyle: {
            fontSize: 14,
            rich: { a: { fontSize: 15, lineHeight: 40 } }
          }
        },
        {
          subtext: `更新时间：${option.updateTime}`,
          bottom: "5%",
          left: "2%",
          textAlign: "auto",
          subtextStyle: {
            color: "#999",
            fontSize: 12
          }
        }
      ];
      option.legend = {
        show: false
      };
      break;
    //
    case "getMonthsNulacid":
    case "getWeeksNulacid":
    case "getDaysNulacid":
    case "getRjryjzDay":
    case "getRjryjzWeek":
    case "getRjryjzMonth":
    case "getWjryjcDay":
    case "getWjryjcWeek":
    case "getWjryjcMonth":
      option.series[0].barWidth = '60%';
      option.color = ["#49B04C", "#E8A12E"];
      option.title = { show: false };
      let _topGrid = "5%";
      let _topLegend = "10%";
      if (
        code == "getRjryjzDay" ||
        code == "getRjryjzWeek" ||
        code == "getRjryjzMonth" ||
        code == "getWjryjcDay" ||
        code == "getWjryjcWeek" ||
        code == "getWjryjcMonth"
      ) {
        option.legend = { show: false };
      } else {
        _topGrid = "15%";
        _topLegend = "4%";
      }
      Object.assign(option.grid, {
        top: _topGrid
      });
      Object.assign(option.series[0], {
        radius: ["0%", "60%"],
        center: ["50%", "55%"]
      });
      Object.assign(option.legend, {
        top: _topLegend
      });
      break;
    default:
      break;
  }

  return option;
}
