/**
 * 緯度経度座標の任意の点や線などをglue上に描画できるように変換する
 *
 */

function ConvertElasticPoints() {

	/**
	 * 指定の点を歪める(xy座標になる)
	 * @param latLng 変換する緯度経度座標
	 * @param centerLatLng Focusの中心緯度経度座標
	 * @param glueInnerRadius Focusのサイズ（pixel）
	 * @param glueOuterRadius Glueのサイズ（pixel）
	 * @param contextMap contextのLeaflet
	 * @param focusMap focusのLeaflet
	 * @param focusGlueLayer FocusGlueレイヤー
	 */
	this.convertLatLngGlueXy = function (latLng, layers, contextMap) {
		var pXy;// あるセグメントにおける点.


		layers.eachLayer(function (layer) {

			var centerLatLng = layer._focusMap.getCenter();
			var glueInnerRadius = parseInt(layer._focusLayer.style.width) / 2;
			var glueOuterRadius = parseInt(layer._glueLayer.style.width) / 2;
			var focusMap = layer._focusMap;
			var focusGlueLayer = layer._focusGlueLayer;
			var focusLayer = layer._focusLayer;

			// 2点の緯度経度から中心までの距離(メートル)を求める.
			var pMeter = focusMap.distance(latLng, centerLatLng);

			// 各領域の端
			var focusBounds = focusMap.getBounds();
			var contextBounds = contextMap.getBounds();

			// マップコンテナの横サイズ（メートル）
			var containerSizeMeterFocus = focusMap.distance(focusBounds.getNorthWest(), focusBounds.getNorthEast());
			var containerSizeMeterContext = contextMap.distance(contextBounds.getNorthWest(), contextBounds.getNorthEast());

			// pixelあたりのメートル
			var meterPerPixelFocus = containerSizeMeterFocus / (focusMap.getSize().x);
			var meterPerPixelContext = containerSizeMeterContext / (contextMap.getSize().x);

			// Glue内側外側の長さ（メートル）
			var glueInnerRadiusMeter = glueInnerRadius * meterPerPixelFocus;
			var glueOuterRadiusMeter = glueOuterRadius * meterPerPixelContext;

			// contextの北西と南東のメルカトル座標
			var mercatorNW = g_latLngMercatorUtility.convertLatLngToMercator(contextBounds.getNorthWest());
			var mercatorSE = g_latLngMercatorUtility.convertLatLngToMercator(contextBounds.getSouthEast());

			// pixelあたりのメルカトル
			var mercatorPerPixel = {
					x: Math.abs(mercatorNW.x - mercatorSE.x) / (contextMap.getSize().x),
					y: Math.abs(mercatorNW.y - mercatorSE.y) / (contextMap.getSize().x)
			};

			// Glue内側外側の長さ（メルカトル）
			var glueInnerLengthMercator = glueInnerRadius * mercatorPerPixel.x;
			var glueOuterLengthMercator = glueOuterRadius * mercatorPerPixel.x;



			// 点について.
			if (pMeter < glueInnerRadiusMeter) {	// focus領域にある.
				pXy = focusMap.latLngToContainerPoint(latLng);

				pXy.x = pXy.x + parseInt(focusGlueLayer.style.left) + parseInt(focusLayer.style.left);
				pXy.y = pXy.y + parseInt(focusGlueLayer.style.top) + parseInt(focusLayer.style.top);

			} else if (glueInnerRadiusMeter < pMeter && pMeter < glueOuterRadiusMeter) {// glue領域にある.
				// glue内側から見て何パーセントの位置にあるか(0~1).
				var glueRatio = (pMeter - glueInnerRadiusMeter) / (glueOuterRadiusMeter - glueInnerRadiusMeter);

				// メルカトル座標に変換
				var elasticPointMercator = g_elasticPoint.calcElasticPoint(g_latLngMercatorUtility.convertLatLngToMercator(latLng),
						g_latLngMercatorUtility.convertLatLngToMercator(centerLatLng), glueRatio,
						glueInnerLengthMercator, glueOuterLengthMercator,
						Math.pow(2, focusMap.getZoom() - contextMap.getZoom()));

				// メルカトル座標をxy座標に変換
				pXy = contextMap.latLngToLayerPoint(g_latLngMercatorUtility.convertMercatorToLatLng(elasticPointMercator));

			};

		});

		if (pXy == null) {// 上記に当てはまらない＝context領域にある.
			pXy = contextMap.latLngToLayerPoint(latLng);
		};
		return pXy;
	}






}