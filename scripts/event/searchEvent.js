/**
 * イベント設定
 * @constructor 
 * @classdesc  YOLPにおいてFocusを作成するイベント処理
 * 
 */
function searchEvent(){

    var marker;


    this.createFocus = function (name,lng,lat) {

        if (marker) {
            marker.remove();
        };
        marker = L.marker([lat, lng]).bindPopup(name).addTo(map);
        marker.openPopup();

        var latlng = { lat: lat, lng: lng };
        console.info(latlng);
        var tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
        var emmaTiles = L.tileLayer(tileUrl);

        this.emmaLayer = L.emmaLayer({
            layers: [emmaTiles],
            latLng: latlng,
            point: map.latLngToLayerPoint(latlng),
            fixedPosition: true,
        }).addTo(map);
    }



}


