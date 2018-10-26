
document.addEventListener('DOMContentLoaded', function (event) {
    var btnSearch = document.getElementById('btnSearch');
    btnSearch.onclick = getLocationUrl;
});

function getLocationUrl() {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: 'searchHistory' },
                function (res) {
                    handlerData(res);
                }
            );
        }
    );
}

var messageEl = document.getElementById('message')

function handlerData(res) {
    if (res.code === 10000) {
        res.data = res.data || '{}';
        var data = JSON.parse(res.data);
        var lowPrice = +data.lowerPrice;
        var lowerDate = new Date(data.lowerDate.split('(')[1].split('-')[0]).toLocaleDateString();
        var spName = data.spName;
        var changePriceCount = data.changePriceCount;
        var objData = prepareData(data.datePrice || []);

        renderChart(objData);
    } else {
        appendMessage('code:' + res.code, 'message', res.message);
    }
}

function appendMessage(message) {
    messageEl.innerHTML += message + '<br>'
}

function renderChart(data) {
    var myChart = echarts.init(document.getElementById('chart-price-histrory'));

    var data = data.reverse().slice(0,50).reverse();

    var xData = data.map(function(d){
        return d.date;
    });

    var yData = data.map(function(d){
        return d.price;
    });  

    var option = {
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: yData,
            type: 'line'
        }]
    };


    myChart.setOption(option);

}


function prepareData(dataStr) {
    var dataArr = dataStr.split('],');
    return dataArr.map(function (d) {
        //[Date.UTC(2017,8,19),3899.00]
        var dArr = (d + ']').replace(/\[|\]/ig, '').replace(/,/ig, '-').split(')')
        return {
            price: Math.abs(+dArr[1]),
            date: new Date(dArr[0].split('(')[1]).toLocaleDateString()
        }
    })
}
