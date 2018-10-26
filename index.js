
/*document.addEventListener('DOMContentLoaded', function (event) {
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
} */
