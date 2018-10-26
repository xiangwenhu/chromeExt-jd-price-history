
// listen for checkForWord request, call getTags which includes callback to sendResponse
chrome.runtime.onMessage.addListener(
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
);


function getRequestUrl(requestUrl) {

    requestUrl = requestUrl.split('?')[0].split('#')[0];
    var url = escape(requestUrl);
    var token = d.encrypt(requestUrl, 2, true);

    var urlArr = [];
    urlArr.push('https://tool.manmanbuy.com/history.aspx?DA=1&action=gethistory&url=');
    urlArr.push(url);
    urlArr.push('&bjid=&spbh=&cxid=&zkid=&w=951&token=');
    urlArr.push(token);

    return urlArr.join('');

}


function http_get(options) {
    var timeout = options.onTimeout
    var url = options.url;
    var success = options.success;
    var error = options.error;

    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.ontimeout = function (event) {
        console.log('request url' + url + ', timeout');
        timeout && timeout()
    }
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success && success(xhr.responseText);
        }
    }
    xhr.onerror = function () {
        error && error(xhr.statusText)
    }
    xhr.send();
}



// Returns the index of the first instance of the desired word on the page.
function executeSearchHistotry(requestUrl, success, error) {
    var isCommodityPage = checkIsCommodityPage(requestUrl);
    if (!isCommodityPage) {
        return error && error({ code: 7000, message: '无效的地址' });
    }

    var url = getRequestUrl(requestUrl);
    if (!url) {
        return error && error({ code: 7000, message: '无效的地址' });
    }

    http_get({
        url: url,
        success: function (data) {
            return success && success({ code: 10000, data });
        },
        error: function (statusText) {
            return error && error({ code: 7002, message: statusText });
        },
        timeout: function () {
            return error && error({ code: 7003, message: '无效的地址' });
        }
    })

}


function checkIsCommodityPage(url) {
    return url.indexOf('item.jd.com') >= 0;
}


