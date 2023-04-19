import moment from "moment";

export function listenVoice(voiceId, target) {
  const className = target.className + '__playing';
  if (window.audioObject && window.audioObject.pause) {
    window.audioObject.pause();
    toggleClass(window.audioDom, className, "remove");
    window.audioObject = null;
  }
  window.audioObject = new Audio(getMediaUrl(voiceId));
  window.audioDom = target;

  window.audioObject.addEventListener("ended", () => {
    window.audioObject = null;
    toggleClass(window.audioDom, className, "remove");
    window.audioDom = null;
  });

  window.audioObject.addEventListener("pause", () => {
    toggleClass(window.audioDom, className, "remove");
  });

  window.audioObject.addEventListener("play", () => {
    toggleClass(window.audioDom, className, "add");
  });

  window.audioObject.play();
}

export function cloneNormalObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function toggleClass(target, className, operation) {
  target.classList[operation](className);
}

export function getMediaUrl(id) {
  return `${process.env.VUE_APP_BASE_API}/api/mediaInfo/preview/${id}`;
}

/**
 * 动态引入js文件
 * @author: tanyuqin
 * @param {String} src 源文件路径
 * @returns Promise
 */
export function loadScript(src) {
  return new Promise(resolve => {
    if (!src) throw new Error("js地址为必填");
    const myScript = document.createElement("script");
    myScript.setAttribute("src", src);
    myScript.onload = resolve;
    document.body.appendChild(myScript);
  });
}

/**
 * 进场动画绑定
 * @author: tanyuqin
 * @param {DomObject} bindingDom 动画绑定元素的dom
 * @param {String} className 动画绑定元素的className
 * @param {Number} delay 动画延迟时间
 * @returns void
 */
export function enterAnimation(bindingDom, className, delay = 800) {
  // 出现在视口内则根据延迟时间进行动画
  const callback = (entries, observer) => {
    const { target } = entries[0];
    target.classList.add(className);
    setTimeout(() => {
      target.classList.remove(className);
      // 移除监听
      observer.unobserve(target);
    }, delay);
  };

  const observer = new IntersectionObserver(callback, { threshold: 1 });
  // 观察dom中的最后一个子元素
  const lastChild = bindingDom.lastElementChild;
  observer.observe(lastChild);
  // 使最后一个子元素滚动到视口中
  lastChild.scrollIntoView({
    behavior: "smooth",
  });
}

/**
 * 比较两个对象是否相同
 * @param {Object} x 对象1
 * @param {Object} y 对象2
 * @returns Boolean 是否相同
 */
export function deepCompare(x, y) {
  let i, l, leftChain, rightChain;
  function compare2Objects(x, y) {
    let p;
    if (
      isNaN(x) &&
      isNaN(y) &&
      typeof x === "number" &&
      typeof y === "number"
    ) {
      return true;
    }
    if (x === y) {
      return true;
    }
    if (
      (typeof x === "function" && typeof y === "function") ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)
    ) {
      return x.toString() === y.toString();
    }
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }
    if (
      Object.prototype.isPrototypeOf.call(x, y) ||
      Object.prototype.isPrototypeOf.call(y, x)
    ) {
      return false;
    }
    if (x.constructor !== y.constructor) {
      return false;
    }
    if (x.prototype !== y.prototype) {
      return false;
    }
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }
    for (p in y) {
      if (y.hasOwnProperty.call(p) !== x.hasOwnProperty.call(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }
    for (p in x) {
      if (y.hasOwnProperty.call(p) !== x.hasOwnProperty.call(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
      switch (typeof x[p]) {
        case "object":
        case "function":
          leftChain.push(x);
          rightChain.push(y);
          if (!compare2Objects(x[p], y[p])) {
            return false;
          }
          leftChain.pop();
          rightChain.pop();
          break;
        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }
    return true;
  }
  if (arguments.length < 1) {
    return true;
  }
  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = [];
    rightChain = [];
    if (!compare2Objects(x, y)) {
      return false;
    }
  }
  return true;
}

//格式化时间
export function formatTime(val) {
  return moment(val).format("YYYY-MM-DD HH:mm:ss");
}

//格式化日期
export function formatDate(val) {
  return moment(val).format("YYYY-MM-DD");
}

//身份证号码脱敏
export function formatID(val) {
  return val.replace(/^(.{2})(?:\d+)(.{3})$/, "$1********$2");
}

export function deepClone(obj) {
  var o;
  // 如果  他是对象object的话  , 因为null,object,array  也是'object';
  if (typeof obj === "object") {
    // 如果  他是空的话
    if (obj === null) {
      o = null;
    } else {
      // 如果  他是数组arr的话
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(deepClone(obj[i]));
        }
      }
      // 如果  他是对象object的话
      else if (obj instanceof Object) {
        o = {};
        for (var j in obj) {
          o[j] = deepClone(obj[j]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
}

// 防抖
// 触发高频事件后一段时间（wait）只会执行一次函数，
// 如果指定时间（wait）内高频事件再次被触发，则重新计算时间

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
/**
 * 根据数组对象的某个字段去重
 * item.name  是[{name:1}] 根据每条数据的name值来去重
 * */
export function unique(arr, val) {
  const res = new Map();
  return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1));
}
// 节流
// 规定在一个单位时间内，只能触发一次函数。
// 如果这个单位时间内触发多次函数，只有一次生效
export function throttle(func, wait) {
  let timeout = null;

  return function () {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * 阿拉伯数字转中文数字
 * @param {*} num 
 * @returns {string}
 */
export function toChinesNum(num) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (let i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? "" : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? "" : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = "0" + noWan;
  }
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}