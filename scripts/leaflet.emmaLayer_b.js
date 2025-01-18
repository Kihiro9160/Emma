var isMouseDown = false;
document.addEventListener('mousedown', function() {
    isMouseDown = true;
});
var init = true;
// マーカーを管理する配列
const markerObjects = [];

L.EmmaLayer = L.Layer.extend({
	options: {
		/** glueの左上位置座標(xy). */
		gluePositionXy: { x: 0, y: 0 },
		/** glue内側の半径(pixel) */
		glueInnerRadius: 170, // 210
		/** glue外側の半径(pixel) */
		glueOuterRadius: 210, // 250

		point: [0, 0],

		zoom: 16,

		zoomOffset: 3,
		layers: [],
		fixedPosition: false,
		latLng: [0, 0],
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
		this._contextMap = null;
		this._focusMap = null;
	},

	getMap: function () {
		return this._focusMap;
	},

	_createFocusMap: function (elt) {
		return new L.Map(elt, {
			layers: this.options.layers,
			zoom: this.options.zoom,
			maxZoom: this._contextMap.getMaxZoom(),
			minZoom: this._contextMap.getMinZoom(),
			crs: this._contextMap.options.crs,
			fadeAnimation: false,
			attributionControl: false,
			zoomControl: false,
			boxZoom: false,
			touchZoom: true,
			scrollWheelZoom: true,
			doubleClickZoom: true,
			dragging: false,
			keyboard: false,
		});
	},

	_getZoom: function () {
		return (this._fixedZoom) ?
				this.options.fixedZoom :
					this._contextMap.getZoom() + this.options.zoomOffset;
	},

	_updateZoom: function () {
		this._focusMap.setZoom(this._getZoom());
	},

	setZIndex: function () {
		if (this._focusGlueLayer) {
			this._circleLayer.style.zIndex = 0;
			this._focusLayer.style.zIndex = 2;
			this._glueLayer.style.zIndex = 1;
		}
	},

	setSize: function (glueOuterRadius, glueInnerRadius) {
		if (this._focusGlueLayer) {
			this._focusGlueLayer.style.width = glueOuterRadius * 2 + 'px';
			this._focusGlueLayer.style.height = glueOuterRadius * 2 + 'px';
			this._focusLayer.style.width = glueInnerRadius * 2 + 'px';
			//this._focusLayer.style.width = glueInnerRadius * 2 + 80 + 'px'; // 幅を＋する
			this._focusLayer.style.height = glueInnerRadius * 2 + 'px';
			this._glueLayer.style.width = glueOuterRadius * 2 + 'px'; // Glueは楕円に非対応
			this._glueLayer.style.height = glueOuterRadius * 2 + 'px';
			this._circleLayer.style.width = glueOuterRadius * 2 + 'px';
			this._circleLayer.style.height = glueOuterRadius * 2 + 'px';

			this._glueLayer.width = glueOuterRadius * 2;
			this._glueLayer.height = glueOuterRadius * 2;


			$(this._focusLayer).attr('originalSize',glueInnerRadius * 2 );
			$(this._focusLayer).attr('fgRatio',glueInnerRadius/glueOuterRadius );
			$(this._glueLayer).attr('originalSize',glueOuterRadius * 2 );

		}
	},

	setPosition: function (glueOuterRadius, glueInnerRadius, point) {
		if (this._focusGlueLayer) {
			this._focusGlueLayer.style.left = point.x - glueOuterRadius + 'px';
			this._focusGlueLayer.style.top = point.y - glueOuterRadius + 'px';
			this._focusLayer.style.left = glueOuterRadius - glueInnerRadius + 'px';
			//this._focusLayer.style.left = glueOuterRadius - glueInnerRadius - 40 + 'px'; // ＋した幅の分の半分左に移動することで中心に戻す
			this._focusLayer.style.top = glueOuterRadius - glueInnerRadius + 'px';
		}
	},

	setLatLng: function (latLng) {
		this.options.latLng = latLng;
		this._focusMap.setView(latLng, this._focusMap.getZoom(), {
			pan: { animate: false }
		});
		g_drawMap.drawGlue(latLng.lng, latLng.lat, this._focusMap.getZoom(), this._contextMap.getZoom(), this._glueLayer, parseInt(this._focusLayer.style.width) / 2, parseInt(this._glueLayer.style.width) / 2);
	},
	

	_updateFixed: function () {
		this._update(this.options.latLng);
	},

	_update: function (latLng) {
		// Focus領域の描画
		this._focusMap.setView(latLng, this._focusMap.getZoom(), {
			pan: { animate: false }
		});
		if (this._isUpdate(event, GLUE_UPDATE_INTARVAL)) {
			g_drawMap.drawGlue(latLng.lng, latLng.lat, this._focusMap.getZoom(), this._contextMap.getZoom(), this._glueLayer, parseInt(this._focusLayer.style.width) / 2, parseInt(this._glueLayer.style.width) / 2);
		};
	},


	/**
	 * 更新可能か
	 * @param e {Object} イベント
	 * @param interval {Number} Glueの更新間隔(ms?)
	 * @return {boolen} trueなら更新可能
	 */
	_isUpdate: function (e, interval) {
		this.diff = e.timeStamp - this.last;
		if (this.diff > interval) {	// 一定時間ごとにglue更新
			this.last = e.timeStamp;
			return true;
		}
		else return false;
	},


	/**
	 * Focus領域の更新
	 */
	_updateFocus: function () {
		//Focus領域の中心の緯度経度
		latLng = this._focusMap.getCenter();
		//緯度経度をブラウザ上の座標に変換
		layerPoint = this._contextMap.latLngToLayerPoint(latLng);

		this._focusGlueLayer.style.left = layerPoint.x - this.opts.glueOuterRadius + 'px';
		this._focusGlueLayer.style.top = layerPoint.y - this.opts.glueOuterRadius + 'px';

		g_drawMap.drawGlue(latLng.lng, latLng.lat, this._focusMap.getZoom(), this._contextMap.getZoom(), this._glueLayer, parseInt(this._focusLayer.style.width) / 2, parseInt(this._glueLayer.style.width) / 2);

		g_GlobalStaticNumber.marker.eachLayer(function (marker) {
			g_drawMap.drawMarker(marker, g_GlobalStaticNumber.layer, map);
		});

		g_GlobalStaticNumber.polyline.eachLayer(function (polyline) {
			g_drawMap.drawPolyline(polyline, g_GlobalStaticNumber.layer, map);
		});

		g_GlobalStaticNumber.geojson.eachLayer(function (geojson) {
			g_drawMap.drawGeoJson(geojson, g_GlobalStaticNumber.layer, map);
		});
		//this._adjustOtherFocus(this);
	},

	_updateFromMouse: function (evt) {
		// layerPointをFocusの中心に設定
		evt.layerPoint.x = parseInt(this._focusGlueLayer.style.left) + parseInt(this._focusGlueLayer.style.width) / 2;
		evt.layerPoint.y = parseInt(this._focusGlueLayer.style.top) + parseInt(this._focusGlueLayer.style.width) / 2;

		this._update(this._contextMap.layerPointToLatLng(evt.layerPoint));
	},

//Focus＋Glueレイヤのサイズを他のFocus＋Glueレイヤとぶつからないようにサイズ変更を行う機能（今のところ2つまでしか動作しないし、アルゴリズムも糞なのでやる気のあるひと頑張ってください・・）
	_adjustOtherFocus: function (self) {
		var radius = parseInt(self._glueLayer.style.width)/2;
		var center = {x:parseInt(self._focusGlueLayer.style.left) + parseInt(self._focusGlueLayer.style.width)/2,y:parseInt(self._focusGlueLayer.style.top) + parseInt(self._focusGlueLayer.style.width)/2};
		g_GlobalStaticNumber.layer.eachLayer(function (e) {
			if(e._leaflet_id != self._leaflet_id){//いまドラッグしているモノ以外
				var e_radius = parseInt(e._glueLayer.style.width)/2;
				var e_center = {x:parseInt(e._focusGlueLayer.style.left) + parseInt(e._focusGlueLayer.style.width)/2,y:parseInt(e._focusGlueLayer.style.top) + parseInt(e._focusGlueLayer.style.width)/2};
				if(Math.pow(e_center.x - center.x,2)+Math.pow(e_center.y - center.y,2) < Math.pow(radius+e_radius,2)){//円が衝突
					while((Math.pow(e_center.x - center.x,2)+Math.pow(e_center.y - center.y,2) < Math.pow(radius+e_radius,2)) && (e_radius > 0)){//円が衝突してるうちは
						if ($("#collision_focus_glue").val() == "all_together"){
							g_dragDropEvent.changeGlueFocusRadiusRatio($(e._focusLayer), $(e._glueLayer),-1);	// focus,glueの大きさを変える.
						}
						else if ($("#collision_focus_glue").val() == "glue_focus"){
							if(e._glueLayer.style.width > e._focusLayer.style.width){//glueの方がfocusより大きいなら
								g_dragDropEvent.changeGlueOuterRadiusNotGlue($(e._glueLayer), -1);	// focusの大きさを変える.
							}
							else{
								g_dragDropEvent.changeGlueInnerOuterRadius($(e._focusLayer), $(e._glueLayer),-1);	// focus,glueの大きさを変える.
							}
						}
						else if ($("#collision_focus_glue").val() == "combining"){
							// 衝突した2つのレイヤの中心座標を計算
							var combinedCenter = {
								x: (self._focusMap.getCenter().lng + e._focusMap.getCenter().lng) / 2,
								y: (self._focusMap.getCenter().lat + e._focusMap.getCenter().lat) / 2
							};
							// 新しいレイヤのサイズを設定（衝突したレイヤの平均サイズを使用）
							var newRadius = (radius + e_radius) / 2;
							var newInnerRadius = (parseInt(self._focusLayer.style.width)/2 + parseInt(e._focusLayer.style.width)/2) / 2;

							var fixed = false;
							if(self.opts.fixedPosition || e.opts.fixedPosition){
								fixed = true;
							}
							
							// 元の2つのレイヤを削除
							g_GlobalStaticNumber.layer.removeLayer(self);
							map.removeLayer(self);
							g_GlobalStaticNumber.layer.removeLayer(e);
							map.removeLayer(e);

							var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
							var emmaTiles = L.tileLayer(tileUrl);
							//glueOuterRadius *= Math.sqrt(2);

							this.emmaLayer = L.emmaLayer({
								layers : [ emmaTiles ],
								latLng : [combinedCenter.y, combinedCenter.x],
								point : map.latLngToLayerPoint([combinedCenter.y, combinedCenter.x]),
								zoom : map.getZoom(),
								glueInnerRadius : newInnerRadius * Math.sqrt(2),
								glueOuterRadius : newRadius * Math.sqrt(2),
								fixedPosition: fixed
							}).addTo(map);
							g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
						}
						else if ($("#collision_focus_glue").val() == "waterDrop"){
							if (isMouseDown){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(e._focusLayer), $(e._glueLayer), -1);
							} else {
								var combinedCenter = {
									x: (self._focusMap.getCenter().lng + e._focusMap.getCenter().lng) / 2,
									y: (self._focusMap.getCenter().lat + e._focusMap.getCenter().lat) / 2
								};
								var newRadius = (radius + e_radius) / 2;
								var newInnerRadius = (parseInt(self._focusLayer.style.width) / 2 + parseInt(e._focusLayer.style.width) / 2) / 2;
	
								var fixed = false;
								if(self.opts.fixedPosition || e.opts.fixedPosition){
									fixed = true;
								}
								
								g_GlobalStaticNumber.layer.removeLayer(self);
								map.removeLayer(self);
								g_GlobalStaticNumber.layer.removeLayer(e);
								map.removeLayer(e);
	
								var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
								var emmaTiles = L.tileLayer(tileUrl);
	
								this.emmaLayer = L.emmaLayer({
									layers: [emmaTiles],
									latLng: [combinedCenter.y, combinedCenter.x],
									point: map.latLngToLayerPoint([combinedCenter.y, combinedCenter.x]),
									zoom: map.getZoom(),
									glueInnerRadius: newInnerRadius * Math.sqrt(2),
									glueOuterRadius: newRadius * Math.sqrt(2),
									fixedPosition: fixed
								}).addTo(map);
								g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
								break;
							}
						}
						else if ($("#collision_focus_glue").val() == "changeScale"){ // デフォルト
							//self._contextMap.zoomIn(1);
							self._contextMap.flyTo([self._contextMap.getCenter().lat, self._contextMap.getCenter().lng], self._contextMap.getZoom() + 1); // ズームインも一緒に行う
							
							var moveEvent = new MouseEvent('mousedown', {
								bubbles: true,
								cancelable: true,								
								clientX: event.clientX,       // マウスのX座標
								clientY: event.clientY        // マウスのY座標
							});
							self._focusGlueLayer.dispatchEvent(moveEvent);
							// 定期的に距離を計算し、しきい値を超えたらズームアウト
							var maxDistance = 7*parseInt(self._focusGlueLayer.style.width)/2; // ズームアウトする距離のしきい値を設定	5*parseInt(self._focusGlueLayer.style.width)/2
							var intervalId = setInterval(function() {
								var distance = Math.sqrt(
									Math.pow((parseInt(self._focusGlueLayer.style.left) + parseInt(self._focusGlueLayer.style.width) / 2) -
											(parseInt(e._focusGlueLayer.style.left) + parseInt(e._focusGlueLayer.style.width) / 2), 2) +
									Math.pow((parseInt(self._focusGlueLayer.style.top) + parseInt(self._focusGlueLayer.style.width) / 2) -
											(parseInt(e._focusGlueLayer.style.top) + parseInt(e._focusGlueLayer.style.width) / 2), 2)
								);

								console.log(distance); // 距離をコンソールに出力して確認

								if (distance > maxDistance) { //現在のFocus半径の7倍
									self._contextMap.zoomOut(1); // ズームアウト
									clearInterval(intervalId); // 監視を停止
								}
							}, 100); // 100msごとにチェック
							// マウスが離されたら監視を停止
							document.addEventListener('mouseup', function onMouseUp() {
								clearInterval(intervalId); // 監視を停止
								document.removeEventListener('mouseup', onMouseUp); // リスナーを削除
							});
							break;
						}
						else if ($("#collision_focus_glue").val() == "changeScale2"){ //操作しているFocusの相対位置が変化しない
							//self._contextMap.setView([(self._focusMap.getCenter().lat+self._contextMap.getCenter().lat)/2, (self._focusMap.getCenter().lng+self._contextMap.getCenter().lng)/2], self._contextMap.getZoom() + 1); // ズームインも一緒に行う
							self._contextMap.flyTo([(self._focusMap.getCenter().lat+self._contextMap.getCenter().lat)/2, (self._focusMap.getCenter().lng+self._contextMap.getCenter().lng)/2], self._contextMap.getZoom() + 1); // ズームインも一緒に行う
							
							var moveEvent = new MouseEvent('mousedown', {
								bubbles: true,
								cancelable: true,								
								clientX: event.clientX,       // マウスのX座標
								clientY: event.clientY        // マウスのY座標
							});
							self._focusGlueLayer.dispatchEvent(moveEvent);
							// 定期的に距離を計算し、しきい値を超えたらズームアウト
							var maxDistance = 5*parseInt(self._focusGlueLayer.style.width)/2; // ズームアウトする距離のしきい値を設定	5*parseInt(self._focusGlueLayer.style.width)/2
							var intervalId = setInterval(function() {
								var distance = Math.sqrt(
									Math.pow((parseInt(self._focusGlueLayer.style.left) + parseInt(self._focusGlueLayer.style.width) / 2) -
											(parseInt(e._focusGlueLayer.style.left) + parseInt(e._focusGlueLayer.style.width) / 2), 2) +
									Math.pow((parseInt(self._focusGlueLayer.style.top) + parseInt(self._focusGlueLayer.style.width) / 2) -
											(parseInt(e._focusGlueLayer.style.top) + parseInt(e._focusGlueLayer.style.width) / 2), 2)
								);

								console.log(distance); // 距離をコンソールに出力して確認

								if (distance > maxDistance) { //現在のFocus半径の5倍
									self._contextMap.flyTo([(self._focusMap.getCenter().lat+self._contextMap.getCenter().lat)/2, (self._focusMap.getCenter().lng+self._contextMap.getCenter().lng)/2], self._contextMap.getZoom() - 1); // ズームインも一緒に行う
									clearInterval(intervalId); // 監視を停止
								}
							}, 100); // 100msごとにチェック
							// マウスが離されたら監視を停止
							document.addEventListener('mouseup', function onMouseUp() {
								clearInterval(intervalId); // 監視を停止
								document.removeEventListener('mouseup', onMouseUp); // リスナーを削除
							});
							break;
						}
						else if ($("#collision_focus_glue").val() == "changeScale3"){ // Focus中心
							self._contextMap.flyTo([self._focusMap.getCenter().lat, self._focusMap.getCenter().lng], self._contextMap.getZoom() + 1);

							var moveEvent = new MouseEvent('mousedown', {
								bubbles: true,
								cancelable: true,								
								clientX: self._focusGlueLayer.style.left-self._focusGlueLayer.style.width/2,
								clientY: self._focusGlueLayer.style.top-self._focusGlueLayer.style.width/2,
							});
							self._focusGlueLayer.dispatchEvent(moveEvent);
							// 定期的に距離を計算し、しきい値を超えたらズームアウト
							var maxDistance = 7*parseInt(self._focusGlueLayer.style.width)/2; // ズームアウトする距離のしきい値を設定	5*parseInt(self._focusGlueLayer.style.width)/2
							var intervalId = setInterval(function() {
								var distance = Math.sqrt(
									Math.pow((parseInt(self._focusGlueLayer.style.left) + parseInt(self._focusGlueLayer.style.width) / 2) -
											(parseInt(e._focusGlueLayer.style.left) + parseInt(e._focusGlueLayer.style.width) / 2), 2) +
									Math.pow((parseInt(self._focusGlueLayer.style.top) + parseInt(self._focusGlueLayer.style.width) / 2) -
											(parseInt(e._focusGlueLayer.style.top) + parseInt(e._focusGlueLayer.style.width) / 2), 2)
								);

								console.log(distance); // 距離をコンソールに出力して確認

								if (distance > maxDistance) { //現在のFocus半径の5倍
									self._contextMap.zoomOut(1); // ズームアウト
									clearInterval(intervalId); // 監視を停止
								}
							}, 100); // 100msごとにチェック
							// マウスが離されたら監視を停止
							document.addEventListener('mouseup', function onMouseUp() {
								clearInterval(intervalId); // 監視を停止
								document.removeEventListener('mouseup', onMouseUp); // リスナーを削除
							});
							break;
						}
						radius = parseInt(self._glueLayer.style.width)/2;
						e_radius = parseInt(e._glueLayer.style.width)/2;
					}
				}
				else{//円が衝突していない	136.89127922058108///35.168721651780494		136.90921783447268///35.169598685900546
					while((Math.pow(e_center.x - center.x,2)+Math.pow(e_center.y - center.y,2) >= Math.pow(radius+e_radius,2)) && (parseInt(e._glueLayer.style.width) < $(e._glueLayer).attr('originalSize'))){//円が衝突してないうちは
						if ($("#collision_focus_glue").val() == "all_together"){
							if(parseInt(self._glueLayer.style.width) < $(self._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(self._focusLayer), $(self._glueLayer),1);	// focus,glueの大きさを変える.
							}
							else if(parseInt(e._glueLayer.style.width) < $(e._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(e._focusLayer), $(e._glueLayer),1);	// focus,glueの大きさを変える.
							}
						}
						else if ($("#collision_focus_glue").val() == "glue_focus"){
							if(parseInt(self._glueLayer.style.width) < $(self._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueOuterRadiusNotGlue($(self._glueLayer), 1);	// glueの大きさを変える.
								if(parseInt(self._focusLayer.style.width) < $(self._focusLayer).attr('originalSize')){
									g_dragDropEvent.changeGlueOuterRadiusNotGlue($(self._focusLayer), 1);	// focusの大きさを変える.
								}
							}
							else if(parseInt(e._glueLayer.style.width) < $(e._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueOuterRadiusNotGlue($(e._glueLayer), 1);	// glueの大きさを変える.
								if(parseInt(e._focusLayer.style.width) < $(e._focusLayer).attr('originalSize')){
									g_dragDropEvent.changeGlueOuterRadiusNotGlue($(e._focusLayer), 1);	// focusの大きさを変える.
								}
							}
						}
						else if ($("#collision_focus_glue").val() == "combining"){
							if(parseInt(self._glueLayer.style.width) < $(self._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(self._focusLayer), $(self._glueLayer),1);	// focus,glueの大きさを変える.
							}
							else if(parseInt(e._glueLayer.style.width) < $(e._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(e._focusLayer), $(e._glueLayer),1);	// focus,glueの大きさを変える.
							}
						}
						else if ($("#collision_focus_glue").val() == "waterDrop"){
							if(parseInt(self._glueLayer.style.width) < $(self._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(self._focusLayer), $(self._glueLayer),1);	// focus,glueの大きさを変える.
							}
							else if(parseInt(e._glueLayer.style.width) < $(e._glueLayer).attr('originalSize')){
								g_dragDropEvent.changeGlueFocusRadiusRatio($(e._focusLayer), $(e._glueLayer),1);	// focus,glueの大きさを変える.
								if (!isMouseDown){
									var combinedCenter = {
										x: (self._focusMap.getCenter().lng + e._focusMap.getCenter().lng) / 2,
										y: (self._focusMap.getCenter().lat + e._focusMap.getCenter().lat) / 2
									};
									var newRadius = (radius + e_radius) / 2;
									var newInnerRadius = (parseInt(self._focusLayer.style.width) / 2 + parseInt(e._focusLayer.style.width) / 2) / 2;
		
									var fixed = false;
									if(self.opts.fixedPosition || e.opts.fixedPosition){
										fixed = true;
									}
									
									g_GlobalStaticNumber.layer.removeLayer(self);
									map.removeLayer(self);
									g_GlobalStaticNumber.layer.removeLayer(e);
									map.removeLayer(e);
		
									var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
									var emmaTiles = L.tileLayer(tileUrl);
		
									this.emmaLayer = L.emmaLayer({
										layers: [emmaTiles],
										latLng: [combinedCenter.y, combinedCenter.x],
										point: map.latLngToLayerPoint([combinedCenter.y, combinedCenter.x]),
										zoom: map.getZoom(),
										glueInnerRadius: newInnerRadius * Math.sqrt(2),
										glueOuterRadius: newRadius * Math.sqrt(2),
										fixedPosition : fixed
									}).addTo(map);
									g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
									break;
								}
							}
						}
						radius = parseInt(self._glueLayer.style.width)/2;
						e_radius = parseInt(e._glueLayer.style.width)/2;
					}
				}
			}
		});
	},

	/*
    インスタンス生成時に作動
	 */
	onAdd: function (map) {
		var self = this;
		console.info("Layer Added");

		this._contextMap = map;
		// Focus+Glue領域を入れるHTML要素
		this._focusGlueLayer = L.DomUtil.create('div', 'focus_glue_layer');
		this._focusGlueLayer.style.position = "absolute";
		// 各領域のHTML要素
		this._glueLayer = L.DomUtil.create('canvas', 'glue_layer', this._focusGlueLayer);
		this._focusLayer = L.DomUtil.create('div', 'focus_layer', this._focusGlueLayer);
		this._circleLayer = L.DomUtil.create('canvas', 'circle_layer', this._focusGlueLayer);
		this._focusLayer.style.position = "absolute";
		this._circleLayer.style.position = "absolute";

		this.last = 0;	// 最後にglueを更新した時刻.
		this.diff = 0;	// 最後にglueを更新してからの何m秒たったか.

		this.time = 0;
		this.count = 0;

		this.opts = this.options;

		this.setSize(this.opts.glueOuterRadius, this.opts.glueInnerRadius);
		this.setPosition(this.opts.glueOuterRadius, this.opts.glueInnerRadius, this.opts.point);
		this.setZIndex();

		// マップ生成
		this._focusMap = this._createFocusMap(this._focusLayer);


		this.setLatLng(this.opts.latLng);

		g_GlobalStaticNumber.upperLeftLngLat.lng = this.opts.latLng.lng - (parseInt(this._focusLayer.style.left) + this.opts.glueOuterRadius) * g_GlobalStaticNumber.lnglatPer1px.lng;
		g_GlobalStaticNumber.upperLeftLngLat.lat = this.opts.latLng.lat + (parseInt(this._focusLayer.style.top) + this.opts.glueOuterRadius) * g_GlobalStaticNumber.lnglatPer1px.lat;

		//ズーム完了時の動作
		this._contextMap.on('zoomend', this._updateFocus, this);
		this._focusMap.on('zoomend', this._updateFocus, this);

		this.resizeFlag = true;

		//Context領域でのマウスイベント
		this._contextMap.on('mouseup', function () { self.resizeFlag = false; }, this);
		this._contextMap.on('mousedown', function () { self.resizeFlag = true; }, this);

		this._adjustOtherFocus(this);
		g_GlobalStaticNumber.marker.eachLayer(function (marker) {
			g_drawMap.drawMarker(marker, g_GlobalStaticNumber.layer, self._contextMap);
		});
		g_GlobalStaticNumber.polyline.eachLayer(function (polyline) {
			g_drawMap.drawPolyline(polyline, g_GlobalStaticNumber.layer, self._contextMap);
		});
		g_GlobalStaticNumber.geojson.eachLayer(function (geojson) {
			g_drawMap.drawGeoJson(geojson, g_GlobalStaticNumber.layer, self._contextMap);
		});



		//glue領域のサイズが変更されたら再描画
		$(this._glueLayer).exResize(function () {
			if (self.resizeFlag == true) {
				g_drawMap.drawGlue(self._focusMap.getCenter().lng, self._focusMap.getCenter().lat, self._focusMap.getZoom(), self._contextMap.getZoom(), self._glueLayer, parseInt(self._focusLayer.style.width) / 2, parseInt(self._glueLayer.style.width) / 2);

				g_GlobalStaticNumber.marker.eachLayer(function (marker) {
					g_drawMap.drawMarker(marker, g_GlobalStaticNumber.layer, self._contextMap);
				});

				g_GlobalStaticNumber.polyline.eachLayer(function (polyline) {
					g_drawMap.drawPolyline(polyline, g_GlobalStaticNumber.layer, self._contextMap);
				});

				g_GlobalStaticNumber.geojson.eachLayer(function (geojson) {
					g_drawMap.drawGeoJson(geojson, g_GlobalStaticNumber.layer, self._contextMap);
				});
			}
		});

		//focus領域のサイズが変更されたら再描画
		$(this._focusLayer).exResize(function () {
			if (self.resizeFlag == true) {
				var xy = {
						x: parseInt(self._focusGlueLayer.style.left) + parseInt(self._focusLayer.style.width) / 2,
						y: parseInt(self._focusGlueLayer.style.top) + parseInt(self._focusLayer.style.width) / 2
				};

				self._focusMap.invalidateSize();

				g_drawMap.drawGlue(self._focusMap.getCenter().lng, self._focusMap.getCenter().lat, self._focusMap.getZoom(), self._contextMap.getZoom(), self._glueLayer, parseInt(self._focusLayer.style.width) / 2, parseInt(self._glueLayer.style.width) / 2);

				g_GlobalStaticNumber.marker.eachLayer(function (marker) {
					g_drawMap.drawMarker(marker, g_GlobalStaticNumber.layer, self._contextMap);
				});

				g_GlobalStaticNumber.polyline.eachLayer(function (polyline) {
					g_drawMap.drawPolyline(polyline, g_GlobalStaticNumber.layer, self._contextMap);
				});

				g_GlobalStaticNumber.geojson.eachLayer(function (geojson) {
					g_drawMap.drawGeoJson(geojson, g_GlobalStaticNumber.layer, self._contextMap);
				});
			}
		});

		this._focusMap.zoomIn(1);

		//引っ張って分離
		if(self.opts.fixedPosition == true){
			var isMD = false;
			var createFocus = true;
			var newFocus;
			var initialPosition = { x: 0, y: 0 };
			var fixedFocusRadius;
			var distance = 0;
			$(self._focusGlueLayer).on('mousedown', function(e) {
				isMD = true;
				initialPosition = { x: self._focusMap.getCenter().lng, y: self._focusMap.getCenter().lat }
				fixedFocusRadius = parseInt(self._focusGlueLayer.style.width)/2;
				self._contextMap.dragging.disable();
			});
			document.addEventListener('mousemove', function(event) {
				if(isMD){
					var currentPosition = { x: event.clientX, y: event.clientY };
					var map = self._contextMap;
					var newFocusLatLng = map.containerPointToLatLng([
						currentPosition.x - map._container.offsetLeft,
						currentPosition.y - map._container.offsetTop
					]);
					distance = Math.sqrt(
						Math.pow(newFocusLatLng.lng - initialPosition.x, 2) +
						Math.pow(newFocusLatLng.lat - initialPosition.y, 2)
					);
					// 固定Focusの中心から一定距離離れたら新しい可動Focusを生成
					if (distance > 0.02) {
						if(createFocus){
							var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
							var emmaTiles = L.tileLayer(tileUrl);

							// 新しい可動Focusを生成
							newFocus = L.emmaLayer({
								layers: [emmaTiles],
								latLng: [newFocusLatLng.lat, newFocusLatLng.lng],
								point: map.latLngToLayerPoint([newFocusLatLng.lat, newFocusLatLng.lng]),
								zoom: map.getZoom(),
								glueInnerRadius: 120,
								glueOuterRadius: 150
							}).addTo(map);
							g_GlobalStaticNumber.layer.addLayer(newFocus);
							createFocus = false;
						}
	
						// 新しいFocusのドラッグイベントを設定
						$(newFocus._focusGlueLayer).draggable({
							start: function (event, ui) {
								map.dragging.disable();
								//newFocus._contextMap.dragging.disable();
								newFocus._adjustOtherFocus(newFocus);
							},
							drag: function (event, ui) {
								map.on('mousemove', self._updateFromMouse, self);
								//self._contextMap.on('mousemove', self._updateFromMouse, self);
								g_GlobalStaticNumber.marker.eachLayer(function (marker) {
									g_drawMap.drawMarker(marker, g_GlobalStaticNumber.layer, self._contextMap);
								});
								g_GlobalStaticNumber.polyline.eachLayer(function (polyline) {
									g_drawMap.drawPolyline(polyline, g_GlobalStaticNumber.layer, self._contextMap);
								});
								g_GlobalStaticNumber.geojson.eachLayer(function (geojson) {
									g_drawMap.drawGeoJson(geojson, g_GlobalStaticNumber.layer, self._contextMap);
								});
								
								self._adjustOtherFocus(self);
							},
							stop: function (event, ui) {
								map.dragging.enable();
								map.off('mousemove', self._updateFromMouse, self);
	
								g_drawMap.drawGlue(self._focusMap.getCenter().lng, self._focusMap.getCenter().lat, self._focusMap.getZoom(), self._contextMap.getZoom(), self._glueLayer, parseInt(self._focusLayer.style.width) / 2, parseInt(self._glueLayer.style.width) / 2);
								//isMD = false;
								self._adjustOtherFocus(self);
							}
						});
					}
				}
			});
			document.addEventListener('mouseup', function() {
				if(isMD) {
					self._contextMap.dragging.enable();
					distance = 0;
					isMD = false;
					createFocus = true;
				}
			});
		}

		this._contextMap.whenReady(function () {
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
				//console.log(position);
				var marker = L.marker([position.lat, position.lng], {
					title : "マーカ",
					alt : position //284,639
				}).addTo(map);
				//var comment = 'よお';
				//marker.bindPopup(comment).openPopup()
	
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

			this._contextMap.addEventListener('contextmenu', function(event) {
				console.log(event);  // イベントが正しく発火しているか確認
				/*const position = {
					x: event.clientX,
					y: event.clientY
				};*/
		
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

//追加
		if(init){
			// 複数のマーカーを設定
			var markers = [
				{ lat: 35.15500, lng: 136.92003, comment: "指定地点３" },
				{ lat: 35.158361, lng: 136.931298, comment: "指定地点２" },
				{ lat: 35.180199, lng: 136.905803, comment: "指定地点１" }
			];
			// 各マーカーを追加し、個別のポップアップを表示
			markers.forEach(function(markerData) {
				var marker = L.marker([markerData.lat, markerData.lng]).addTo(map);
				var popupContent = `<b style="font-size:18px;">${markerData.comment}</b>`; // フォントサイズを指定
				var popup = L.popup({ autoClose: false, closeOnClick: false }) // ポップアップを常に開いた状態に設定
					.setContent(popupContent);
				marker.bindPopup(popup).openPopup(); // ポップアップを開く

				// マーカーとポップアップを保存
				markerObjects.push({ marker: marker, popup: popup });
			});
			init = false;
		};
//
		
		this._focusMap.whenReady(function () {

			self._contextMap.on('mouseover', function (e) {
				self._focusMap.on('mouseover', function (e) {
					self._contextMap.touchZoom.disable();
				});
				self._focusMap.on('mouseout', function (e) {
					self._contextMap.touchZoom.enable();
				});
			});

			if (this.opts.fixedPosition == false) {
				// focusGlueLayerをドラッグ可能にする処理
				$(self._focusGlueLayer).draggable({
					start: function (event, ui) {
						//Context領域のマップのドラッグイベントを取得しないようにする
						self._contextMap.dragging.disable();
						self._adjustOtherFocus(self);
						
						markerObjects.forEach(function(obj) {
							obj.marker.closePopup();
						});
					},
					drag: function (event, ui) {
						self._contextMap.on('mousemove', self._updateFromMouse, self);
						g_GlobalStaticNumber.marker.eachLayer(function (marker) {
							g_drawMap.drawMarker(marker, g_GlobalStaticNumber.layer, self._contextMap);
						});
				    	const startTime = performance.now(); // 開始時間

						g_GlobalStaticNumber.polyline.eachLayer(function (polyline) {
							g_drawMap.drawPolyline(polyline, g_GlobalStaticNumber.layer, self._contextMap);
						});
				    	const endTime = performance.now(); // 終了時間
				    	self.count++;
				    	self.time += endTime - startTime; // 何ミリ秒かかったかを表示する

				    	//console.log(self.count+"回平均"+self.time/self.count);
						g_GlobalStaticNumber.geojson.eachLayer(function (geojson) {
							g_drawMap.drawGeoJson(geojson, g_GlobalStaticNumber.layer, self._contextMap);
						});

						self._adjustOtherFocus(self);
					},
					// glueの更新.
					stop: function (event, ui) {
						//Context領域のマップのドラッグイベントを取得するようにする
						self._contextMap.dragging.enable();
						self._contextMap.off('mousemove', self._updateFromMouse, self);

						g_drawMap.drawGlue(self._focusMap.getCenter().lng, self._focusMap.getCenter().lat, self._focusMap.getZoom(), self._contextMap.getZoom(), self._glueLayer, parseInt(self._focusLayer.style.width) / 2, parseInt(self._glueLayer.style.width) / 2);
						isMouseDown = false;
						self._adjustOtherFocus(self);
					}
				});
			};

			// カスタムコンテキストメニューのHTMLを作成
			const customContextMenu = document.createElement('div');
			customContextMenu.id = 'customContextMenu';
			customContextMenu.style.display = 'none';
			customContextMenu.style.position = 'absolute';
			customContextMenu.style.backgroundColor = 'white';
			customContextMenu.style.border = '1px solid #ccc';
			customContextMenu.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
			customContextMenu.style.zIndex = '10000';

			const menuList = document.createElement('ul');
			menuList.style.listStyle = 'none';
			menuList.style.padding = '0';
			menuList.style.margin = '0';

			const measureItem = document.createElement('li');
			measureItem.innerText = '計測';
			measureItem.style.padding = '8px 12px';
			measureItem.style.cursor = 'pointer';
			measureItem.onmouseover = function() { this.style.backgroundColor = '#eee'; };
			measureItem.onmouseout = function() { this.style.backgroundColor = 'white'; };
			measureItem.onclick = function() {
				//alert(self._contextMap.latLngToContainerPoint(self._contextMap.getCenter()));
				alert($("#collision_focus_glue").val());
				customContextMenu.style.display = 'none';
			};

			const switchItem = document.createElement('li');
			switchItem.style.padding = '8px 12px';
			switchItem.style.cursor = 'pointer';
			switchItem.onmouseover = function() { this.style.backgroundColor = '#eee'; };
			switchItem.onmouseout = function() { this.style.backgroundColor = 'white'; };
			if(self.opts.fixedPosition == false){
				switchItem.innerText = '固定Focusに切り替え';
				switchItem.onclick = function() {
					var newCenter = {
						x: self._focusMap.getCenter().lng,
						y: self._focusMap.getCenter().lat
					};
					g_GlobalStaticNumber.layer.removeLayer(self);
					map.removeLayer(self);
					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers: [emmaTiles],
						latLng : [newCenter.y, newCenter.x],
						point : map.latLngToLayerPoint([newCenter.y, newCenter.x]),
						zoom: map.getZoom(),
						fixedPosition: true
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
					customContextMenu.style.display = 'none';
				};
			} else {
				switchItem.innerText = '可動Focusに切り替え';
				switchItem.onclick = function() {
					var newCenter = {
						x: self._focusMap.getCenter().lng,
						y: self._focusMap.getCenter().lat
					};
					g_GlobalStaticNumber.layer.removeLayer(self);
					map.removeLayer(self);
					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers: [emmaTiles],
						latLng : [newCenter.y, newCenter.x],
						point : map.latLngToLayerPoint([newCenter.y, newCenter.x]),
						zoom: map.getZoom()
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
					customContextMenu.style.display = 'none';
				};
			}

			const separateItem = document.createElement('li');
			separateItem.innerText = '分離';
			separateItem.style.padding = '8px 12px';
			separateItem.style.cursor = 'pointer';
			separateItem.onmouseover = function() { this.style.backgroundColor = '#eee'; };
			separateItem.onmouseout = function() { this.style.backgroundColor = 'white'; };
			separateItem.onclick = function() {
				// 分離させるレイヤのサイズを確認
				var radius = parseInt(self._glueLayer.style.width)/2;
				if (390 <= radius){ //Level4 420(2倍)
					// 新しいレイヤのサイズを設定
					var newInnerRadius = 170;
					var newRadius = 210;
					// 分離させるレイヤの中心座標を計算
					// 左
					var separatedCenterL = {
						x: self._focusMap.getCenter().lng - 0.015,
						y: self._focusMap.getCenter().lat
					};
					// 右
					var separatedCenterR = {
						x: self._focusMap.getCenter().lng + 0.015,
						y: self._focusMap.getCenter().lat
					};

					// 元のレイヤを削除
					g_GlobalStaticNumber.layer.removeLayer(self);
					map.removeLayer(self);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterL.y, separatedCenterL.x],
						point : map.latLngToLayerPoint([separatedCenterL.y, separatedCenterL.x]),
						zoom : map.getZoom(),
						glueInnerRadius : newInnerRadius * Math.sqrt(2),
						glueOuterRadius : newRadius * Math.sqrt(2)
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterR.y, separatedCenterR.x],
						point : map.latLngToLayerPoint([separatedCenterR.y, separatedCenterR.x]),
						zoom : map.getZoom(),
						glueInnerRadius : newInnerRadius * Math.sqrt(2),
						glueOuterRadius : newRadius * Math.sqrt(2)
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
				}
				else if (330 <= radius && radius < 390){ //Level3 358.4924240・・・(√3倍)
					// 新しいレイヤのサイズを設定
					var newInnerRadius = 170;
					var newRadius = 210;
					// 分離させるレイヤの中心座標を計算
					// 左
					var separatedCenterL = {
						x: self._focusMap.getCenter().lng - 0.015,
						y: self._focusMap.getCenter().lat
					};
					// 右
					var separatedCenterR = {
						x: self._focusMap.getCenter().lng + 0.015,
						y: self._focusMap.getCenter().lat
					};

					// 元のレイヤを削除
					g_GlobalStaticNumber.layer.removeLayer(self);
					map.removeLayer(self);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterL.y, separatedCenterL.x],
						point : map.latLngToLayerPoint([separatedCenterL.y, separatedCenterL.x]),
						zoom : map.getZoom()
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterR.y, separatedCenterR.x],
						point : map.latLngToLayerPoint([separatedCenterR.y, separatedCenterR.x]),
						zoom : map.getZoom(),
						glueInnerRadius : newInnerRadius * Math.sqrt(2),
						glueOuterRadius : newRadius * Math.sqrt(2)
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
				}
				else if (255 <= radius && radius < 330){ //Level2 296.9848480・・・(√2倍)
					// 分離させるレイヤの中心座標を計算
					// 左
					var separatedCenterL = {
						x: self._focusMap.getCenter().lng - 0.01,
						y: self._focusMap.getCenter().lat
					};
					// 右
					var separatedCenterR = {
						x: self._focusMap.getCenter().lng + 0.01,
						y: self._focusMap.getCenter().lat
					};

					// 元のレイヤを削除
					g_GlobalStaticNumber.layer.removeLayer(self);
					map.removeLayer(self);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterL.y, separatedCenterL.x],
						point : map.latLngToLayerPoint([separatedCenterL.y, separatedCenterL.x]),
						zoom : map.getZoom()
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterR.y, separatedCenterR.x],
						point : map.latLngToLayerPoint([separatedCenterR.y, separatedCenterR.x]),
						zoom : map.getZoom()
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
				}
				else if (165 < radius && radius < 255){ //Level1 210(1倍)
					// 新しいレイヤのサイズを設定
					var newInnerRadius = 170;
					var newRadius = 210;
					// 分離させるレイヤの中心座標を計算
					// 左
					var separatedCenterL = {
						x: self._focusMap.getCenter().lng - 0.01,
						y: self._focusMap.getCenter().lat
					};
					// 右
					var separatedCenterR = {
						x: self._focusMap.getCenter().lng + 0.01,
						y: self._focusMap.getCenter().lat
					};

					// 元のレイヤを削除
					g_GlobalStaticNumber.layer.removeLayer(self);
					map.removeLayer(self);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterL.y, separatedCenterL.x],
						point : map.latLngToLayerPoint([separatedCenterL.y, separatedCenterL.x]),
						zoom : map.getZoom(),
						glueInnerRadius : newInnerRadius / Math.sqrt(2),
						glueOuterRadius : newRadius / Math.sqrt(2)
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);

					var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
					var emmaTiles = L.tileLayer(tileUrl);
					this.emmaLayer = L.emmaLayer({
						layers : [ emmaTiles ],
						latLng : [separatedCenterR.y, separatedCenterR.x],
						point : map.latLngToLayerPoint([separatedCenterR.y, separatedCenterR.x]),
						zoom : map.getZoom(),
						glueInnerRadius : newInnerRadius / Math.sqrt(2),
						glueOuterRadius : newRadius / Math.sqrt(2)
					}).addTo(map);
					g_GlobalStaticNumber.layer.addLayer(this.emmaLayer);
				}/*
				else{ // if (radius <= 165){ //Level0 148.4924240(1/√2倍)
					//分離不可
					alert('これ以上小さく分離できません');
				}*/
				customContextMenu.style.display = 'none';
			};
			const deleteItem = document.createElement('li');
			deleteItem.innerText = '削除';
			deleteItem.style.padding = '8px 12px';
			deleteItem.style.cursor = 'pointer';
			deleteItem.onmouseover = function() { this.style.backgroundColor = '#eee'; };
			deleteItem.onmouseout = function() { this.style.backgroundColor = 'white'; };
			deleteItem.onclick = function() {
				g_GlobalStaticNumber.layer.removeLayer(self);
				map.removeLayer(self);
				customContextMenu.style.display = 'none';
			};

			menuList.appendChild(measureItem);
			menuList.appendChild(switchItem);
			menuList.appendChild(separateItem);
			menuList.appendChild(deleteItem);
			customContextMenu.appendChild(menuList);
			document.body.appendChild(customContextMenu);

			// this._focusGlueLayer にコンテキストメニューイベントを設定
			this._focusGlueLayer.addEventListener('contextmenu', function(event) {
				event.preventDefault(); // デフォルトのコンテキストメニューを無効化
				
				// 分離メニューの表示制御
				var radius = parseInt(self._glueLayer.style.width) / 2;
				if (radius <= 165 || self.opts.fixedPosition == true) {
					separateItem.style.display = 'none'; // Level0の場合、分離メニューを非表示
				} else {
					separateItem.style.display = 'block'; // その他の場合、分離メニューを表示
				}

				// カスタムコンテキストメニューの位置を設定
				customContextMenu.style.top = event.pageY + 'px';
				customContextMenu.style.left = event.pageX + 'px';
				customContextMenu.style.display = 'block';
			});

			// コンテキストメニュー外をクリックしたらメニューを非表示
			document.addEventListener('click', function() {
				customContextMenu.style.display = 'none';
			});
		}, this);

		// focusGluePaneにfocusGlueLayerを入れる
		map.getPanes().focusgluePane.appendChild(this._focusGlueLayer);

		// マップコンテナのサイズが変更されたときにマップのサイズをそれに合わせて変更する
		this._focusMap.invalidateSize();

		return this;
	},

	/**
    削除時に実行
	 */
	onRemove: function (map) {
		// layers must be explicitely removed before map destruction,
		// otherwise they can't be reused if the mg is re-added
		for (var i = 0, l = this.options.layers.length; i < l; i++) {
			this._focusMap.removeLayer(this.options.layers[i]);
		}
		this._contextMap.off('zoomend', this._updateFocus, this);
		this._focusMap.remove();
		this._focusGlueLayer.parentNode.removeChild(this._focusGlueLayer);
		console.info("Layer Removed");
		return this;
	}
});

L.emmaLayer = function (options) {
	return new L.EmmaLayer(options);
};