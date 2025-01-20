/**
 * 基本的な地図の描画 $(function(){...});はHTML読み込み完了後，実行
 *
 */

var map;

$(function() {

	// 初期の地図位置スケールを指定
	map = L.map('map_element', {
		zoomControl : false,
		doubleClickZoom : false,
		closePopupOnClick : false,
	});

    // マウスホイールでのズームレベル調整
    map.on('wheel', function(e) {
        e.preventDefault();
        if (e.originalEvent.deltaY < 0) {
            // ホイールを上に回転（ズームイン）
            map.setZoom(map.getZoom() + 1);
        } else {
            // ホイールを下に回転（ズームアウト）
            map.setZoom(map.getZoom() - 1);
        }
    });

	//Focus+Glue領域を入れるpaneの作成
	map.createPane('focusgluePane');
	map.getPane('focusgluePane').style.zIndex = 300;

	g_GlobalStaticNumber.result = L.layerGroup().addTo(map);
	g_GlobalStaticNumber.marker = L.layerGroup().addTo(map);
	g_GlobalStaticNumber.polyline = L.layerGroup().addTo(map);
	g_GlobalStaticNumber.geojson = L.layerGroup().addTo(map);
	g_GlobalStaticNumber.layer = L.layerGroup().addTo(map);

	// 栄バスターミナルをデフォの場所にする
	var 栄LatLng = {
		lat : 35.170003,
		lng : 136.908548
	};
	map.setView(栄LatLng, 15);/*
	var 名工大LatLng = {
		lat : 35.156311,
		lng : 136.923079
	};
	map.setView(名工大LatLng, 15);*/

	var busIcon = L.icon({
		iconUrl : 'images/busstop_blue.png',
		iconSize : [ 60, 60 ],
		iconAnchor : [ 30, 60 ],
		popupAnchor : [ -3, -91 ],
		shadowUrl : 'css/images/marker-shadow.png',
		shadowSize : [ 60, 60 ],
		shadowAnchor : [ 15, 60 ]
	});

	// 自作のOSMタイルサーバを使う.
	var tile2Layer = L
			.tileLayer(
					'http://tsgMapServer.yamamoto.nitech.ac.jp/osm_tiles/{z}/{x}/{y}.png',
					{
						attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					});

	// // OSMのタイルレイヤーを追加
	var tileLayer = L
			.tileLayer(
					'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
					{
						attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
						updateWhenIdle : false,
					});

	tileLayer.addTo(map);// このレイヤーをデフォルトで表示する.

	// レイヤーの構成
	// ベースレイヤー(デフォルト表示).
	var baseLayers = {
		"OpenStreetMap" : tileLayer,
		"localOSM" : tile2Layer,
	};

	L.control.layers(baseLayers).addTo(map);

	// add control scale
	L.control.scale().addTo(map);

//追加
	map.whenReady(function () {
		// カスタムコンテキストメニューのHTMLを作成
		var create = false;
		const customContextMenu2 = document.createElement('div');
		customContextMenu2.id = 'customContextMenu2';
		customContextMenu2.style.display = 'none';
		customContextMenu2.style.position = 'absolute';
		customContextMenu2.style.backgroundColor = 'white';
		customContextMenu2.style.border = '1px solid #ccc';
		customContextMenu2.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
		customContextMenu2.style.zIndex = '10000';

		const menuList2 = document.createElement('ul');
		menuList2.style.listStyle = 'none';
		menuList2.style.padding = '0';
		menuList2.style.margin = '0';

		const createItem = document.createElement('li');
		createItem.innerText = '生成 ▸';
		createItem.style.padding = '8px 12px';
		createItem.style.cursor = 'pointer';
		createItem.onmouseover = function() { 
			this.style.backgroundColor = '#eee'; 
			showDerivedMenu(this); // 派生メニューを表示 
		};
		createItem.onmouseout = function() { 
			this.style.backgroundColor = 'white'; 
		};
		createItem.onclick = function() {
			showDerivedMenu(this); // 派生メニューを表示
		};

		menuList2.appendChild(createItem);
		customContextMenu2.appendChild(menuList2);
		document.body.appendChild(customContextMenu2);

		// 派生メニューを表示するための要素
		const derivedMenu = document.createElement('div');
		derivedMenu.style.display = 'none';
		derivedMenu.style.position = 'absolute';
		derivedMenu.style.left = '100%'; // 生成メニューの右側に表示
		derivedMenu.style.top = '0'; // 同じY位置
		derivedMenu.style.backgroundColor = 'white';
		derivedMenu.style.border = '1px solid #ccc';
		derivedMenu.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
		derivedMenu.style.zIndex = '10001'; // カスタムメニューより上に表示

		const derivedItem1 = document.createElement('div');
		derivedItem1.innerText = 'マーカー';
		derivedItem1.style.padding = '8px 12px';
		derivedItem1.style.cursor = 'pointer';
		derivedItem1.onmouseover = function() { this.style.backgroundColor = '#eee'; };
		derivedItem1.onmouseout = function() { this.style.backgroundColor = 'white'; };
		derivedItem1.onclick = function() {
			// マーカーを生成する処理をここに追加
			var myIcon = L.icon({
				iconUrl : 'css/images/busstop.png',
				iconSize : [ 39, 91 ],
				iconAnchor : [ 22, 94 ],
				popupAnchor : [ -3, -91 ],
				shadowUrl : 'css/images/marker-shadow.png',
				shadowSize : [ 68, 91 ],
				shadowAnchor : [ 22, 94 ]
			});
			const position = map.containerPointToLatLng({ 
				x: parseInt(customContextMenu2.style.left, 10), 
				y: parseInt(customContextMenu2.style.top, 10) - 55
			});
			var marker = L.marker([position.lat, position.lng], {
				title : position,//"マーカ",
				alt : position //284,639
			}).addTo(map);

			// マーカーにクリックイベントリスナーを追加して削除する機能
			marker.on('contextmenu', function() {
				map.removeLayer(marker);
			});
			console.log("マーカーを生成しました");
			customContextMenu2.style.display = 'none';
			hideDerivedMenu(); // 派生メニューを隠す
		};

		const derivedItem2 = document.createElement('div');
		derivedItem2.innerText = '可動Focus';
		derivedItem2.style.padding = '8px 12px';
		derivedItem2.style.cursor = 'pointer';
		derivedItem2.onmouseover = function() { this.style.backgroundColor = '#eee'; };
		derivedItem2.onmouseout = function() { this.style.backgroundColor = 'white'; };
		derivedItem2.onclick = function() {
			// 可動Focusを生成する処理をここに追加
			const position = map.containerPointToLatLng({ 
				x: parseInt(customContextMenu2.style.left, 10), 
				y: parseInt(customContextMenu2.style.top, 10) - 55
			});
			var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
			var emmaTiles = L.tileLayer(tileUrl);
			this.emmaLayer = L.emmaLayer({
				layers: [emmaTiles],
				latLng: position,
				point: map.latLngToLayerPoint(position),
				zoom: map.getZoom()
			}).addTo(map);
			g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
			console.log("可動Focusを生成しました");
			customContextMenu2.style.display = 'none';
			hideDerivedMenu(); // 派生メニューを隠す
		};

		const derivedItem3 = document.createElement('div');
		derivedItem3.innerText = '固定Focus';
		derivedItem3.style.padding = '8px 12px';
		derivedItem3.style.cursor = 'pointer';
		derivedItem3.onmouseover = function() { this.style.backgroundColor = '#eee'; };
		derivedItem3.onmouseout = function() { this.style.backgroundColor = 'white'; };
		derivedItem3.onclick = function() {
			// 固定Focusを生成する処理をここに追加
			const position = map.containerPointToLatLng({ 
				x: parseInt(customContextMenu2.style.left, 10), 
				y: parseInt(customContextMenu2.style.top, 10) - 55
			});
			var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
			var emmaTiles = L.tileLayer(tileUrl);
			this.emmaLayer = L.emmaLayer({
				layers : [ emmaTiles ],
				latLng : [position.lat, position.lng],
				point : map.latLngToLayerPoint([position.lat, position.lng]),
				zoom : map.getZoom(),
				fixedPosition : true
			}).addTo(map);
			g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
			console.log("固定Focusを生成しました");
			customContextMenu2.style.display = 'none';
			hideDerivedMenu(); // 派生メニューを隠す
		};

		derivedMenu.appendChild(derivedItem1);
		derivedMenu.appendChild(derivedItem2);
		derivedMenu.appendChild(derivedItem3);
		document.body.appendChild(derivedMenu);

		// 派生メニューを表示する関数
		function showDerivedMenu(createItem) {
			derivedMenu.style.display = 'block';
			const rect = createItem.getBoundingClientRect(); // 生成メニューの位置を取得
			derivedMenu.style.top = rect.top + 'px'; // Y位置を調整
			derivedMenu.style.left = (rect.right + 5) + 'px'; // X位置を調整
		}

		// 派生メニューを隠す関数
		function hideDerivedMenu() {
			derivedMenu.style.display = 'none';
		}

		map.addEventListener('contextmenu', function(event) {
			console.log(event);  // イベントが正しく発火しているか確認

			if (event.originalEvent) {
				event.originalEvent.preventDefault(); // Leafletのイベントオブジェクトから標準のイベントにアクセス
				customContextMenu2.style.top = event.originalEvent.pageY + 'px';
				customContextMenu2.style.left = event.originalEvent.pageX + 'px';
				customContextMenu2.style.display = 'block';
				hideDerivedMenu(); // コンテキストメニューが表示されたときは派生メニューを隠す
				console.log("カスタムメニューを表示しました");
			} else {
				console.error("originalEventが見つかりません");
			}
		});

		// コンテキストメニュー外をクリックしたらメニューを非表示
		document.addEventListener('click', function() {
			customContextMenu2.style.display = 'none';
			hideDerivedMenu(); // 派生メニューも非表示にする
		});
	}, this);

	map.on('click', function(e) {
		// Context領域をクリックでFocus+Glue領域を作成
		//if ($("#tool").val() == "magnifying_glass"
		//		|| $("#tool").val() == "fixed_magnifying_glass") {
		if ($("#left_click").val() == "magnifying_glass"
				|| $("#left_click").val() == "fixed_magnifying_glass") {

			var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
			var emmaTiles = L.tileLayer(tileUrl);

			//if ($("#tool").val() == "fixed_magnifying_glass") {//固定Focus
			if ($("#left_click").val() == "fixed_magnifying_glass") {//固定Focus
				this.emmaLayer = L.emmaLayer({
					layers : [ emmaTiles ],
					latLng : e.latlng,
					point : map.latLngToLayerPoint(e.latlng),
					zoom : map.getZoom(),
					fixedPosition : true
				}).addTo(map);
			} else {
				this.emmaLayer = L.emmaLayer({
					layers: [emmaTiles],
					latLng: e.latlng,
					point: map.latLngToLayerPoint(e.latlng),
					zoom: map.getZoom()
				}).addTo(map);
			}
			//$("#left_click").val("none");
			g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
			console.log(g_GlobalStaticNumber.layer);
		}
		;
	});

	map.on('click', function(e) {
		// Context領域をクリックでマーカを作成
		//if ($("#tool").val() == "marker") {
		if ($("#left_click").val() == "marker") {
			var myIcon = L.icon({
				iconUrl : 'css/images/busstop.png',
				iconSize : [ 39, 91 ],
				iconAnchor : [ 22, 94 ],
				popupAnchor : [ -3, -91 ],
				shadowUrl : 'css/images/marker-shadow.png',
				shadowSize : [ 68, 91 ],
				shadowAnchor : [ 22, 94 ]
			});

			var marker = L.marker(e.latlng, {
				title : "マーカ",
				alt : e.latlng
			}).addTo(map);
			//var comment = 'よお';
			//marker.bindPopup(comment).openPopup()

			// マーカーにクリックイベントリスナーを追加して削除する機能
            marker.on('contextmenu', function() {
                map.removeLayer(marker);
            });
		}
		;
		if ($("#left_click").val() == "none") {

			console.info(e.latlng)
		}
		;
	});

	map.on('layeradd', function(e) {
		if('animatedMarker' in e.layer.options){
			console.info("animatedMarker");
		}
		else if (e.layer._latlng != undefined) {// 追加されたレイヤーがマーカー
			console.info("marker");
			e.layer.options.alt = e.layer._latlng;// マーカーの元LatLngを保存
			g_GlobalStaticNumber.marker.addLayer(e.layer);
		}
		// ポリライン分割機能
		else if (e.layer._latlngs != undefined) {// 追加されたレイヤーがポリライン
			console.info("poly");
			e.layer.options.alt = e.layer._latlngs;// マーカーの元LatLngを保存
			// console.info(e);

			var threshold = 0.0005

			var newPoints = [];
			var points = e.layer.options.alt;
			var oldPoint = e.layer.options.alt[0];
			// console.info(oldPoint);
			$.each(points, function(index, aval) {
				// 二点間の距離を求める
				var distance = Math.sqrt(Math.pow(aval.lat - oldPoint.lat, 2)
						+ Math.pow(aval.lng - oldPoint.lng, 2));

				if (distance > threshold) {

					var count = Math.floor(distance / threshold);
					// console.info(count);
					var latD = (aval.lat - oldPoint.lat) / count;
					var lngD = (aval.lng - oldPoint.lng) / count;
					var latLng = oldPoint;
					for (var i = 1; i < count; i++) {
						latLng = {
							lat : latLng.lat + latD,
							lng : latLng.lng + lngD
						};
						// var marker = L.marker(latLng).addTo(map);
						newPoints.push(latLng);
					}
				}

				oldPoint = aval;
				newPoints.push(aval);
			});

			e.layer.setLatLngs(newPoints);
			e.layer.options.alt = newPoints;

			g_GlobalStaticNumber.polyline.addLayer(e.layer);

		}
	});

	map.on('zoomend', function(e) {
		console.info('Zoom level:', map.getZoom());
	});

//ここからバス路線描画機能だよ
//基本的にhttps://github.com/bbecquet/Leaflet.PolylineOffsetのBus Linesってとこをパクってます。
//なので一回上のサイトを見てから下を見るとわかりやすいよ！
	var lineWeight = 4;

	var lineColors = {
		栄14 : '#947f28',
		幹栄1 : '#e60012',
		栄15 : '#6c2b3e',
		名駅16 : '#00a7ea',
		栄12 : '#0075c2',
		深夜1 : '#407038',
		栄16 : '#ed6c00',
		栄26 : '#00a7ea',
		黒川12 : '#009e3b',
		栄27 : '#ed6c00',
		西巡回 : '#e39423',
		栄25 : '#aa5b00',
		栄11 : '#e07f00',
		基幹2 : '#5f3b4b',
		栄20 : '#953b2a',
		栄17 : '#006447',
		基幹1 : '#5f3b4b',
		栄18 : '#009e3b',
		高速1 : '#00561f',
		栄21 : '#595757',
		栄23 : '#ed6c00'
	};

	// 各地図オブジェクトのレイヤグループ
	var outlines = L.layerGroup();
	var lineBg = L.layerGroup();
	var busLines = L.layerGroup();
	var busStops = L.layerGroup();

	var ends = [];
	function addStop(ll) {
		for (var i = 0, found = false; i < ends.length && !found; i++) {
			found = (ends[i].lat == ll.lat && ends[i].lng == ll.lng);
		}
		if (!found) {
			ends.push(ll);
		}
	}

	var lineSegment, linesOnSegment, segmentCoords, segmentWidth;
	g_GeoJson.data.features.forEach(function(lineSegment) {
		segmentCoords = L.GeoJSON.coordsToLatLngs(
				lineSegment.geometry.coordinates, 0);

		linesOnSegment = lineSegment.properties.lines;
		segmentWidth = linesOnSegment.length * (lineWeight + 1);

		L.polyline(segmentCoords, {
			color : '#fff',
			weight : segmentWidth + 3,
			opacity : 1
		}).addTo(lineBg);

		for (var j = 0; j < linesOnSegment.length; j++) {
			L.polyline(
					segmentCoords,
					{
						color : lineColors[linesOnSegment[j]],
						weight : lineWeight,
						opacity : 1,
						offset : j * (lineWeight + 1) - (segmentWidth / 2)
								+ ((lineWeight + 1) / 2),
						rosen : linesOnSegment[j]
					}).addTo(busLines);
		}

		addStop(segmentCoords[0]);
		addStop(segmentCoords[segmentCoords.length - 1]);
	});


	outlines.addTo(map);
	lineBg.addTo(map);
	busLines.addTo(map);
	busStops.addTo(map);

	// レンダリングの範囲を広げる
	var renderer = map.getRenderer(outlines);
	renderer.options.padding = 2;

	var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var emmaTiles = L.tileLayer(tileUrl, {
		edgeBufferTiles : 5
	});
	var testEmma = L.emmaLayer({
		layers : [ emmaTiles ],
		latLng : 栄LatLng,
		point : map.latLngToLayerPoint(栄LatLng),
		zoom : map.getZoom()
	}).addTo(map);
	g_GlobalStaticNumber.layer.addLayer(testEmma);


	//右クリックしたらAnimatedMarkerを作成し、それにFocus＋Glueレイヤを追従させる機能（未完）
	//消していいよ
	/*map.on('contextmenu', function(e) {

		var testLine;

		busLines.eachLayer(function(layer) {
			if (layer.options.rosen.indexOf("栄21") >= 0) {
				console.info(layer._latlngs.length);

				testLine = layer._latlngs;

			}
		});

		var line = L.polyline(testLine);
		var animatedMarker = L.animatedMarker(testLine);
		animatedMarker.options.animatedMarker = true;

		console.info(animatedMarker);

		map.addLayer(animatedMarker);

		animatedMarker.on('move',function(e){
			testEmma._focusMap.panTo(e.latlng, {
			animate : true,
			duration : 0.5
		});
			testEmma._updateFocus();
		});


	});*/

	//ここらへんはベンチマーク用
//	var stats = new Stats();
//	stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
//	document.body.appendChild(stats.dom);
//
//	function animate() {
//
//		stats.begin();
//
//		// monitored code goes here
//
//		stats.end();
//
//		requestAnimationFrame(animate);
//
//	}
//
//	requestAnimationFrame(animate);

});