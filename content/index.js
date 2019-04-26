// listen for checkForWord request, call getTags which includes callback to sendResponse
/* chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'searchHistory') {

            executeSearchHistotry(window.location.href, function (res) {
                return sendResponse(res);
            }, function (res) {
                return sendResponse(res);
            })

            //表示异步
            return true;
        }
    }
); */

init();

function init() {
  if (shouldRegister()) {
    registerHTML();
    registerEvents();
  }
}

function shouldRegister() {
  const hostName = document.location.hostname;
  return checkIsCommodityPage(hostName);
}

function registerHTML() {
  var el = document.createElement("div");
  el.style =
    "position:fixed; right:0; top:0;z-index: 99999;background: burlywood;";
  el.innerHTML = `   
        <input type="button" value="历史价格查询" id='btnSearch' />
        <input type="button" value="展开" id='btnHide' />
        <div id='message'></div>
        <div id='chart-price-histrory' style="height:250px;width:1200px; display:none">
        </div>   
    `;
  document.body.appendChild(el);
}

var messageEl;
function registerEvents() {
  var btnSearch = document.getElementById("btnSearch");
  messageEl = document.getElementById("message");
  var chartEl = document.getElementById("chart-price-histrory");
  var btnHide = document.getElementById("btnHide");
  btnSearch.onclick = function() {
    chartEl.style.display = "block";
    btnHide.value = "关闭";
    var url = getRequestUrl(window.location.href);
    executeSearchHistotry(
      window.location.href,
      function(res) {
        handlerData(res);
      },
      function(res) {
        handlerError(res);
      }
    );
  };

  btnHide.onclick = function() {
    var isVisible = chartEl.style.display === "block";
    btnHide.value = isVisible ? "展开" : "关闭";
    chartEl.style.display = isVisible ? "none" : "block";
  };
}

function getRequestUrl(requestUrl) {
  requestUrl = requestUrl.split("?")[0].split("#")[0];
  var url = escape(requestUrl);
  var token = d.encrypt(requestUrl, 2, true);

  var urlArr = [];
  urlArr.push(
    "https://babydairy2017.cloudapp.net:6006/api/history.aspx?DA=1&action=gethistory&url="
  );
  urlArr.push(url);
  urlArr.push("&bjid=&spbh=&cxid=&zkid=&w=951&token=");
  urlArr.push(token);

  return urlArr.join("");
}

function http_get(options) {
  var timeout = options.onTimeout;
  var url = options.url;
  var success = options.success;
  var error = options.error;

  var xhr = new XMLHttpRequest();
  xhr.timeout = 10000;
  xhr.ontimeout = function(event) {
    console.log("request url" + url + ", timeout");
    timeout && timeout();
  };
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      success && success(xhr.responseText);
    }
  };
  xhr.setRequestHeader("_appId", "jd-h-price");
  xhr.setRequestHeader("_key", "jj-dd-pp");
  xhr.setRequestHeader("_target", "https://tool.manmanbuy.com");

  xhr.onerror = function() {
    error && error(xhr.statusText);
  };
  xhr.send();
}

// Returns the index of the first instance of the desired word on the page.
function executeSearchHistotry(requestUrl, success, error) {
  var isCommodityPage = checkIsCommodityPage(requestUrl);
  requestUrl = modifyUrl(requestUrl);
  if (!isCommodityPage) {
    return error && error({ code: 7000, message: "无效的商品地址页" });
  }

  var url = getRequestUrl(requestUrl);
  if (!url) {
    return (
      error && error({ code: 7000, message: "获取商品历史价格查询地址失败" })
    );
  }

  http_get({
    url: url,
    success: function(data) {
      return success && success({ code: 10000, data });
    },
    error: function(statusText) {
      return error && error({ code: 7002, message: statusText });
    },
    timeout: function() {
      return error && error({ code: 7003, message: "请求超时请重试" });
    }
  });
}

function checkIsCommodityPage(url) {
  return url.indexOf("item.jd.") >= 0 || url.indexOf("item.yiyaojd.") >= 0;
}

function modifyUrl(url) {
  return url.replace("item.yiyaojd.", "item.jd.");
}

function handlerData(res) {
  if (res.code === 10000) {
    if (!res.data) {
      appendMessage("未查询到商品的相关信息");
      return;
    }

    res.data = res.data || "{}";
    var data = JSON.parse(res.data);
    var lowPrice = +data.lowerPrice;
    var lowerDate = data_string(data.lowerDate);
    var spName = data.spName;
    var changePriceCount = data.changePriceCount;
    var objData = prepareData(data.listPrice || []);

    renderChart(spName, objData);
  } else {
    appendMessage("code:" + res.code + "    message:", res.message);
  }
}

function prepareData(listPrice) {
  return listPrice.map(function(d) {
    return {
      price: d.pr,
      date: data_string(d.dt)
    };
  });
}

function data_string(str) {
  var d = eval("new " + str.substr(1, str.length - 2));
  var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  var ar_time = [d.getHours(), d.getMinutes(), d.getSeconds()];
  for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
  for (var i = 0; i < ar_time.length; i++) ar_time[i] = dFormat(ar_time[i]);
  return ar_date.join("-") + " " + ar_time.join(":");

  function dFormat(i) {
    return i < 10 ? "0" + i.toString() : i;
  }
}

function renderChart(title, data) {
  var myChart = echarts.init(document.getElementById("chart-price-histrory"));

  var data = data
    .reverse()
    .slice(0, 100)
    .reverse();

  var xData = data.map(function(d) {
    return d.date;
  });

  var yData = data.map(function(d) {
    return d.price;
  });

  var option = {
    title: {
      text: title
    },
    tooltip: {
      formatter: "{b0}: {c0}"
    },
    xAxis: {
      type: "category",
      data: xData
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: yData,
        type: "line",
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" }
          ]
        }
      }
    ]
  };

  myChart.setOption(option);
}

function appendMessage(message) {
  messageEl.innerHTML += message + "<br>";
}

function handlerError(res) {
  appendMessage(res.message || "发生未知错误, 请重试");
}
