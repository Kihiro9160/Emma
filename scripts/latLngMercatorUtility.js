/**
 * 緯度経度(EPSG:4326)と球面メルカトル座標(EPSG:3857)の変換などのユーティリティー
 * 
 * @author murase
 *
 */
function LatLngMercatorUtility() {

    /** 地球の半径 */
    var EARTH_RADIUS = 6378137;



    //http://qiita.com/kochizufan/items/bf880c8d2b25385d4efe
    /**
     * 緯度経度座標系から，球面メルカトル座標系へと変換
     * @param aLngLat 緯度経度
     * @return メルカトル座標
     */
    this.convertLatLngToMercator = function (aLatLng) {
        /** 球面メルカトル座標系 */
        var mercator = {
            x: EARTH_RADIUS * aLatLng.lng * Math.PI / 180,
            y: EARTH_RADIUS * Math.log(Math.tan(Math.PI / 360 * (90 + aLatLng.lat)))
        };

        return mercator;
    };

    /**
	 * 球面メルカトル座標系から緯度経度座標系へと変換
	 * @param aMercator メルカトル座標
	 * @return 緯度経度
	 */
    this.convertMercatorToLatLng = function (aMercator) {
        /** 緯度経度座標系 */
        var latLng = {
            lat: -90 + Math.atan(Math.pow(Math.E, aMercator.y / EARTH_RADIUS)) * 360 / Math.PI,
            lng: 180 / (Math.PI * EARTH_RADIUS) * aMercator.x
        };
        return latLng;
    }

}