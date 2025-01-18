//「電話帳」カセットを指定して、「現在地周辺2km以内のお店」を検索する場合の例


function YahooLocalSearchAPI() {

    //  ============アプリ共通変数の定義============
    var YOLP_API = {};

    //アプリケーションID
    YOLP_API.appid = "dj0zaiZpPUZaNld4QmQ5eTJRSCZzPWNvbnN1bWVyc2VjcmV0Jng9OGI-";

    //電話帳カセットID
    YOLP_API.telephoneBookCassetId = "d8a23e9e64a4c817227ab09858bc1330";

    //Yahoo!ローカルサーチAPI
    YOLP_API.localSearchAPIURL = "http://search.olp.yahooapis.jp/OpenLocalPlatform/V1/localSearch";

    var marker = [];
    //var focusMarker = [];

    $(function () {
        //地図の中心から(2000km)でクエリに関する地点を検索

        g_GlobalStaticNumber.result.clearLayers();
        //g_GlobalStaticNumber.focusResult.clearLayers();


        var lat = map.getCenter().lat;
        var lng = map.getCenter().lng;
        var num_of_results = 15;
        var distant = 2000;
        var query = document.form1.textBox1.value;
        YOLP_API.localSearchWithQuery(lat, lng, num_of_results, distant, query, function (ydf, status) {
            var tmpHtml = "";
            if (query == "") {
                tmpHtml = "<li>ワードを入力してください</li>";
            } else if (ydf.ResultInfo.Count === 0) {
                tmpHtml = "<li>該当する店舗がありません</li>";
            } else {
                for (var i = 0; i < ydf.ResultInfo.Count; i++) {
                    tmpHtml += '<li><a href="#" onclick= "g_location.moveLocation(';
                    tmpHtml += ydf.Feature[i].Geometry.Coordinates;
                    tmpHtml += ");g_searchEvent.createFocus('" + ydf.Feature[i].Name + "', " + ydf.Feature[i].Geometry.Coordinates + ");"
                    tmpHtml += "g_GlobalStaticNumber.result.clearLayers();"
                    tmpHtml += '" data-point="' + ydf.Feature[i].Geometry.Coordinates + '">';
                    tmpHtml += ydf.Feature[i].Name;
                    tmpHtml += '</a></li>';
                    coordinates = ydf.Feature[i].Geometry.Coordinates.split(",");

                        var latLng = { lat: coordinates[1], lng: coordinates[0] }
                        marker[i] = L.marker(latLng, { title: "マーカ", alt: latLng }).bindPopup(ydf.Feature[i].Name);
                        //focusMarker[i] = L.marker([coordinates[1], coordinates[0]]).bindPopup(ydf.Feature[i].Name);
                        g_GlobalStaticNumber.result.addLayer(marker[i]);
                        //g_GlobalStaticNumber.focusResult.addLayer(focusMarker[i]);

                }
            }
            $('#spot-lists').show();
            $('#spot-lists').empty();
            $('#spot-lists').append(tmpHtml);

            //$("#focus_glue_layer").hide();

            g_GlobalStaticNumber.array = g_GlobalStaticNumber.result.getLayers();
            //g_GlobalStaticNumber.focusArray = g_GlobalStaticNumber.focusResult.getLayers();
            g_GlobalStaticNumber.array[0].openPopup();
            //g_GlobalStaticNumber.focusArray[0].openPopup();

            g_drawMap.drawFocusGlue();

        });
    });



    YOLP_API.localSearchWithQuery = function (lat, lng, num_of_results, distant, query, callback) {
        $.ajax({
            "url": YOLP_API.localSearchAPIURL,
            "data": {
                "appid": YOLP_API.appid,  //アプリケーションID
                "results": num_of_results,      //取得できるデータの最大件数
                "output": "json",      //データの取得形式
                "cid": YOLP_API.telephoneBookCassetId, //電話帳カセットID
                "lat": lat,            //検索中心位置(緯度)
                "lon": lng,            //検索中心位置(経度)
                "sort": "dist",         //検索結果の並べ替え(近い順)
                "dist": distant,              //検索範囲(km)
                "query": query          //検索キーワード
            },
            "dataType": "jsonp",
            "success": callback
        });
    }
}