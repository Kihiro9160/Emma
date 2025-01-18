/**
 * 空の処理
 * @constructor
 * @classdesc 地図の描画に関するクラス
 *
 */
function DrawMap() {

    /**
	 * glueの描画
	 * @param lng {Number} 中心の経度
	 * @param lat {Number} 中心の緯度
	 * @param focus_zoom_level {Number} focusのズームレベル
	 * @param context_zoom_level {Number} contextのズームレベル
	 * @param glueLayer {element} Glue領域のHTML element
	 * @param glueInnerRadius {Number} Glue内側の半径
	 * @param glueOuterRadius {Number} Glue外側の半径

	 */
    this.drawGlue = function (lng, lat, focus_zoom_level, context_zoom_level, glueLayer, glueInnerRadius, glueOuterRadius) {
        // 地図画像の描画.

        var img = new Image();      //Image obj作成

        var glueImageArray = {
            roadGlueCar: "http://rain-vm2.yamamoto.nitech.ac.jp/EmmaGlueMuraseOriginal/MainServlet?" +
            "type=" + "DrawElasticRoad" +
            "&centerLngLat=" + lng + "," + lat +
            "&focus_zoom_level=" + focus_zoom_level +
            "&context_zoom_level=" + context_zoom_level +
            "&glue_inner_radius=" + glueInnerRadius +
            "&glue_outer_radius=" + glueOuterRadius +
            "&roadType=" + "car",
            roadGlueAll: "http://rain-vm2.yamamoto.nitech.ac.jp/EmmaGlueMuraseOriginal/MainServlet?" +
            "type=" + "DrawElasticRoad" +
            "&centerLngLat=" + lng + "," + lat +
            "&focus_zoom_level=" + focus_zoom_level +
            "&context_zoom_level=" + context_zoom_level +
            "&glue_inner_radius=" + glueInnerRadius +
            "&glue_outer_radius=" + glueOuterRadius +
            "&roadType=" + "all&isDrawPolygon=true",
            strokeGlue: "http://rain-vm2.yamamoto.nitech.ac.jp/EmmaGlueMuraseOriginal/MainServlet?" +
            "type=" + "DrawElasticStroke_v2" +
            "&centerLngLat=" + lng + "," + lat +
            "&focus_zoom_level=" + focus_zoom_level +
            "&context_zoom_level=" + context_zoom_level +
            "&glue_inner_radius=" + glueInnerRadius +
            "&glue_outer_radius=" + glueOuterRadius +
            "&roadType=" + "car",
            strokeGlueConn: "http://rain-vm2.yamamoto.nitech.ac.jp/EmmaGlueMuraseOriginal/MainServlet?" +
            "type=" + "DrawElasticStrokeConnectivity" +
            "&centerLngLat=" + lng + "," + lat +
            "&focus_zoom_level=" + focus_zoom_level +
            "&context_zoom_level=" + context_zoom_level +
            "&glue_inner_radius=" + glueInnerRadius +
            "&glue_outer_radius=" + glueOuterRadius +
            "&roadType=" + "car",
            mitinari: "http://rain-vm2.yamamoto.nitech.ac.jp/EmmaGlueMuraseOriginal/MainServlet?" +
            "type=" + "DrawMitinariSenbetuAlgorithm" +
            "&centerLngLat=" + lng + "," + lat +
            "&focus_zoom_level=" + focus_zoom_level +
            "&context_zoom_level=" + context_zoom_level +
            "&glue_inner_radius=" + glueInnerRadius +
            "&glue_outer_radius=" + glueOuterRadius +
            "&roadType=" + "car",
            drawGlue_v2: "http://rain-vm2.yamamoto.nitech.ac.jp/EmmaGlueMuraseOriginal/MainServlet?" +
            "type=" + "DrawGlue_v2" +
            "&centerLngLat=" + lng + "," + lat +
            "&focus_zoom_level=" + focus_zoom_level +
            "&context_zoom_level=" + context_zoom_level +
            "&glue_inner_radius=" + glueInnerRadius +
            "&glue_outer_radius=" + glueOuterRadius +
            "&roadType=" + "car",
        };

        // ラジオボタンの選択状態でどのglueを使うか決める.
        img.src = glueImageArray[$("select[name='glue_style'] option:selected").val()];
        //console.log(img.src);

        // 画像読込みを待って、処理続行
        img.onload = function () {
            var canvas = glueLayer;
            if (!canvas || !canvas.getContext) { console.info("can not getContext"); return false; }
            var context = canvas.getContext('2d');

            //refer to http://www.html5.jp/canvas/how6.html
            context.scale(1, 1);
            //	console.log(context.drawImage(img, 0, 0, 400, 400));
            context.drawImage(img, 0, 0);
        };
    };


    /**
	 * マーカの緯度経度計算
	 * @param marker マーカ
	 * @param layers Focus＋Glueレイヤの集合
	 * @param contextMap ContextのLeaflet

	 */
    this.drawMarker = function (marker, layers, contextMap) {

        var point = g_convertElasticPoints.convertLatLngGlueXy(marker.options.alt, layers, contextMap);
        var latLng = contextMap.layerPointToLatLng(point);
        marker.setLatLng(latLng);


    };

    /**
	 * ポリラインの緯度経度計算
	 * @param polyline ポリライン
	 * @param layers Focus＋Glueレイヤの集合
	 * @param contextMap ContextのLeaflet

	 */
    this.drawPolyline = function (polyline, layers, contextMap) {

        var newPoints = [];
        var points = polyline.options.alt;
        $.each(points, function (index, aval) {
        	if(aval[0] != undefined){
            // latlng形式に変換
            var val = { lat: aval[0], lng: aval[1] };
        	}
        	else {
        		var val = aval;
        	}
            var point = g_convertElasticPoints.convertLatLngGlueXy(val, layers, contextMap);
            var latLng = contextMap.layerPointToLatLng(point);
            newPoints.push(latLng);
        });

        polyline.setLatLngs(newPoints);

    };

    /**
	 * GeoJsonの緯度経度計算
	 * @param geojson GeoJson形式のデータ
	 * @param layers Focus＋Glueレイヤの集合
	 * @param contextMap ContextのLeaflet

	 */
    this.drawGeoJson = function (geojson, layers, contextMap) {

        var newPoints = [];
        var points = geojson.options.alt;

        $.each(points, function (index, aval) {
            // latlng形式に変換
            var val = aval;
            var point = g_convertElasticPoints.convertLatLngGlueXy(val, layers, contextMap);
            var latLng = contextMap.layerPointToLatLng(point);
            newPoints.push(latLng);
        });

        geojson.setLatLngs(newPoints);

    };

	this.eraseAllFocus = function() {
		// Focus全削除のロジックをここに追加
		console.log("全てのFocusを削除します");
		// 実際の削除ロジックをここに追加
		g_GlobalStaticNumber.layer.clearLayers();
	};
	this.eraseAllLayer = function() {
		// レイヤー全削除のロジックをここに追加
		console.log("全てのレイヤーを削除します");
		// 実際の削除ロジックをここに追加
		g_GlobalStaticNumber.layer.clearLayers();
		g_GlobalStaticNumber.marker.clearLayers();
		g_GlobalStaticNumber.polyline.clearLayers();
	};

    /**
	 * ウェブページ右下のプルダウンメニューから選んだ項目を実行するとこ
	 * 主にtestなどはデバックなどで使ってた

	 */
	this.selectAction = function () {
		/*if ($("#tool").val() == "erase_all_focus") {
			$("#tool").val("none");
			g_GlobalStaticNumber.layer.clearLayers();
		};
		if ($("#tool").val() == "erase_all_layer") {
			$("#tool").val("none");
			g_GlobalStaticNumber.layer.clearLayers();
			g_GlobalStaticNumber.marker.clearLayers();
			g_GlobalStaticNumber.polyline.clearLayers();
		};*/

		if ($("#tool").val() == "test1") {

			$("#tool").val("none");
			//テスト用プログラム
			g_GlobalStaticNumber.polyline.clearLayers();
			g_GlobalStaticNumber.marker.clearLayers();



			g_GeoJson.data.features.forEach(function(lineSegment) {
		    	if(lineSegment.properties.lines.indexOf('深夜1') >= 0){//4が存在するなら
		    		lineSegment.properties.lines = ['深夜1'];
				    console.info(lineSegment);
		    	}
		    	else lineSegment.properties.lines = [];
		    });



			var lineWeight = 5;
//			var lineColors = ['#947f28', '#e60012', '#6c2b3e', '#00a7ea', '#0075c2', '#407038', '#ed6c00', '#00a7ea', '#009e3b'];
			var lineColors = {
					栄14:'#947f28',
					幹栄1:'#e60012',
					栄15:'#6c2b3e',
					名駅16:'#00a7ea',
					栄12:'#0075c2',
					深夜1:'#407038',
					栄16:'#ed6c00',
					栄26:'#00a7ea',
					黒川12:'#009e3b',
					栄27:'#ed6c00',
					西巡回:'#e39423',
					栄25:'#aa5b00',
					栄11:'#e07f00',
					基幹2:'#5f3b4b'
			};

			// manage overlays in groups to ease superposition order
			var outlines = L.layerGroup();
			var lineBg = L.layerGroup();
			var busLines = L.layerGroup();
			var busStops = L.layerGroup();

			var ends = [];
			function addStop(ll) {
				for(var i=0, found=false; i<ends.length && !found; i++) {
					found = (ends[i].lat == ll.lat && ends[i].lng == ll.lng);
				}
				if(!found) {
					ends.push(ll);
				}
			}

			var lineSegment, linesOnSegment, segmentCoords, segmentWidth;
			g_GeoJson.data.features.forEach(function(lineSegment) {
				segmentCoords = L.GeoJSON.coordsToLatLngs(lineSegment.geometry.coordinates, 0);

				linesOnSegment = lineSegment.properties.lines;
				segmentWidth = linesOnSegment.length * (lineWeight + 1);

				L.polyline(segmentCoords, {
					color: '#000',
					weight: segmentWidth + 5,
					opacity: 1
				}).addTo(outlines);

				L.polyline(segmentCoords, {
					color: '#fff',
					weight: segmentWidth + 3,
					opacity: 1
				}).addTo(lineBg);

				for(var j=0;j<linesOnSegment.length;j++) {
					L.polyline(segmentCoords, {
						color: lineColors[linesOnSegment[j]],
						weight: lineWeight,
						opacity: 1,
						offset: j * (lineWeight + 1) - (segmentWidth / 2) + ((lineWeight + 1) / 2)
					}).setText('      '+'    '.repeat(j)+linesOnSegment[j],{center: false, attributes:{'fill':'black','text-shadow': '2px 2px #ff0000'}}).addTo(busLines);
				}

				addStop(segmentCoords[0]);
				addStop(segmentCoords[segmentCoords.length - 1]);
			});

//			ends.forEach(function(endCoords) {
//				L.circleMarker(endCoords, {
//					color: '#000',
//					fillColor: '#ccc',
//					fillOpacity: 1,
//					radius: 10,
//					weight: 4,
//					opacity: 1
//				}).addTo(busStops);
//			});

			outlines.addTo(map);
			lineBg.addTo(map);
			busLines.addTo(map);
			busStops.addTo(map);





		};


		if ($("#tool").val() == "test2") {
			$("#tool").val("none");
			g_GlobalStaticNumber.layer.clearLayers();
			g_GlobalStaticNumber.marker.clearLayers();
			g_GlobalStaticNumber.polyline.clearLayers();

			//テスト用プログラム
			g_GlobalStaticNumber.polyline.clearLayers();
			g_GlobalStaticNumber.marker.clearLayers();



			g_GeoJson.data.features.forEach(function(lineSegment) {
		    	if(lineSegment.properties.lines.indexOf('栄11') >= 0){//4が存在するなら
		    		lineSegment.properties.lines = ['栄11'];
				    console.info(lineSegment);
		    	}
		    	else if(lineSegment.properties.lines.indexOf('基幹2') >= 0){//4が存在するなら
		    		lineSegment.properties.lines = ['基幹2'];
				    console.info(lineSegment);
		    	}
		    	else lineSegment.properties.lines = [];
		    });



			var lineWeight = 5;
//			var lineColors = ['#947f28', '#e60012', '#6c2b3e', '#00a7ea', '#0075c2', '#407038', '#ed6c00', '#00a7ea', '#009e3b'];
			var lineColors = {
					栄14:'#947f28',
					幹栄1:'#e60012',
					栄15:'#6c2b3e',
					名駅16:'#00a7ea',
					栄12:'#0075c2',
					深夜1:'#407038',
					栄16:'#ed6c00',
					栄26:'#00a7ea',
					黒川12:'#009e3b',
					栄27:'#ed6c00',
					西巡回:'#e39423',
					栄25:'#aa5b00',
					栄11:'#e07f00',
					基幹2:'#5f3b4b'
			};

			// manage overlays in groups to ease superposition order
			var outlines = L.layerGroup();
			var lineBg = L.layerGroup();
			var busLines = L.layerGroup();
			var busStops = L.layerGroup();

			var ends = [];
			function addStop(ll) {
				for(var i=0, found=false; i<ends.length && !found; i++) {
					found = (ends[i].lat == ll.lat && ends[i].lng == ll.lng);
				}
				if(!found) {
					ends.push(ll);
				}
			}

			var lineSegment, linesOnSegment, segmentCoords, segmentWidth;
			g_GeoJson.data.features.forEach(function(lineSegment) {
				segmentCoords = L.GeoJSON.coordsToLatLngs(lineSegment.geometry.coordinates, 0);

				linesOnSegment = lineSegment.properties.lines;
				segmentWidth = linesOnSegment.length * (lineWeight + 1);

				L.polyline(segmentCoords, {
					color: '#000',
					weight: segmentWidth + 5,
					opacity: 1
				}).addTo(outlines);

				L.polyline(segmentCoords, {
					color: '#fff',
					weight: segmentWidth + 3,
					opacity: 1
				}).addTo(lineBg);

				for(var j=0;j<linesOnSegment.length;j++) {
					L.polyline(segmentCoords, {
						color: lineColors[linesOnSegment[j]],
						weight: lineWeight,
						opacity: 1,
						offset: j * (lineWeight + 1) - (segmentWidth / 2) + ((lineWeight + 1) / 2)
					}).setText('      '+'    '.repeat(j)+linesOnSegment[j],{center: false, attributes:{'fill':'black','text-shadow': '2px 2px #ff0000'}}).addTo(busLines);
				}

				addStop(segmentCoords[0]);
				addStop(segmentCoords[segmentCoords.length - 1]);
			});

//			ends.forEach(function(endCoords) {
//				L.circleMarker(endCoords, {
//					color: '#000',
//					fillColor: '#ccc',
//					fillOpacity: 1,
//					radius: 10,
//					weight: 4,
//					opacity: 1
//				}).addTo(busStops);
//			});

			outlines.addTo(map);
			lineBg.addTo(map);
			busLines.addTo(map);
			busStops.addTo(map);

			var busIcon = L.icon({
				iconUrl: 'images/busstop.png',
				iconSize: [60, 60],
				iconAnchor: [30, 60],
				popupAnchor: [-3, -91],
				shadowUrl: 'css/images/marker-shadow.png',
				shadowSize: [60, 60],
				shadowAnchor: [15, 60]
			});
			var busIcon2 = L.icon({
				iconUrl: 'images/busstop_blue.png',
				iconSize: [60, 60],
				iconAnchor: [30, 60],
				popupAnchor: [-3, -91],
				shadowUrl: 'css/images/marker-shadow.png',
				shadowSize: [60, 60],
				shadowAnchor: [15, 60]
			});

			var test1 = L.marker([35.21512129959081,136.88913345336917]).addTo(map);
			test1.setIcon(busIcon);
			test1.bindTooltip('<center><strong><font size="+1">出発地</font><br><font size="+2">●●バス停</strong></font></center>', { offset: [-30, -30], permanent: true, direction: "left" });
			var test2 = L.marker([35.1825206869941,136.9052588939667]).addTo(map);
			test2.setIcon(busIcon);
			test2.bindTooltip('<center><strong><font size="+1">経由地</font><br><font size="+2">××バス停</strong></font></center>', { offset: [-30, -30], permanent: true, direction: "left" });
			var test3 = L.marker([35.18228831081343,136.90596699714663]).addTo(map);
			test3.setIcon(busIcon2);
			test3.bindTooltip('<center><strong><font size="+1">経由地</font><br><font size="+2">△△バス停</strong></font></center>', { offset: [30, -30], permanent: true, direction: "right" });
			var test5 = L.marker([35.179543590940696,136.98448061943057]).addTo(map);
			test5.setIcon(busIcon2);
			var test4 = L.marker([35.17935943708822,136.98700189590457]).addTo(map);
			test5.bindTooltip('<center><strong><font size="+1">目的地最寄り</font><br><font size="+2">□□バス停</strong></font></center>', { offset: [-30, -30], permanent: true, direction: "left" });
			test4.bindTooltip('<center><strong><font size="+1">目的地</font><br><font size="+2">なんとか公園</strong></font></center>', {permanent: true, direction: "right" });


			var bounds = [[35.21512129959081,136.88913345336917],[35.17935943708822,136.98700189590457]];
			map.flyToBounds(bounds, { padding: [140, 0], animate: true, duration: 1 });


			map.once("moveend",function () {
				var tileUrl = 'http://tsgMapServer.yamamoto.nitech.ac.jp/osm_tiles/{z}/{x}/{y}.png';
				var emmaTiles1 = L.tileLayer(tileUrl);
				var emmaLayer1 = L.emmaLayer({
					layers: [emmaTiles1],
					latLng: [35.21512129959081,136.88913345336917],
					point: map.latLngToLayerPoint([35.21512129959081,136.88913345336917]),
					zoom: map.getZoom()+1
				}).addTo(map);
				g_GlobalStaticNumber.layer.addLayer(emmaLayer1);

				var emmaTiles2 = L.tileLayer(tileUrl);
				var emmaLayer2 = L.emmaLayer({
					layers: [emmaTiles2],
					latLng: [35.1825206869941,136.9052588939667],
					point: map.latLngToLayerPoint([35.1825206869941,136.9052588939667]),
					zoom: map.getZoom()+2
				}).addTo(map);
				g_GlobalStaticNumber.layer.addLayer(emmaLayer2);

				var emmaTiles3 = L.tileLayer(tileUrl);
				var emmaLayer3 = L.emmaLayer({
					layers: [emmaTiles3],
					latLng: [35.17935943708822,136.98700189590457],
					point: map.latLngToLayerPoint([35.17935943708822,136.98700189590457]),
					zoom: map.getZoom()+1
				}).addTo(map);
				g_GlobalStaticNumber.layer.addLayer(emmaLayer3);








			});

		};





	};


}

