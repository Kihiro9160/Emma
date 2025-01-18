function Location() {

    this.moveLocation = function (lng, lat) {
        $('#spot-lists').hide();
        map.setView([lat, lng], 17);
        //fmap.setView([lat, lng], 16);
    }


    this.goToSeto = function () {
        //記念館をデフォの場所にする
     map.setView([35.1867077288567, 137.1097719669342], 15);
    }

    this.goToNagakute = function () {
        //記念館をデフォの場所にする
        map.setView([35.174607, 137.086802], 15);
    }

    this.goToMeikou = function () {
        //名工大をデフォの場所にする
        map.setView([35.15625, 136.92309], 15);
    }




    this.currentLocation = function () {
        toastr.info("現在地を取得しています");

        // 現在位置の取得
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError,{ enableHighAccuracy: true });

    }

    // 取得成功
    this.geoSuccess = function(position) {
        
        // 緯度
        g_GlobalStaticNumber.currentLat = position.coords.latitude;
        // 軽度
        g_GlobalStaticNumber.currentLng = position.coords.longitude;
        // 緯度経度の誤差(m)
        var accuracy = Math.floor(position.coords.accuracy);

        toastr.success("現在地を取得しました");

        map.setView([g_GlobalStaticNumber.currentLat, g_GlobalStaticNumber.currentLng], 15);
        //fmap.setView([g_GlobalStaticNumber.currentLat, g_GlobalStaticNumber.currentLng], 16);
    }

    // 取得失敗(拒否)
    this.geoError = function(){
        toastr.error("現在地を取得できませんでした");
    }


    
    this.facilitySearch = function (facility) {

        var result = $.grep(g_GeoJson.data[0].features, (function (elem, index) {
            return (String(elem.properties.name).indexOf(facility) >= 0);
        }));

        var polygon = L.geoJSON(result[0]);
        map.fitBounds(polygon.getBounds());

        lastClickPoint = polygon.getBounds().getCenter();
        g_GlobalStaticNumber.marker.clearLayers();

        console.info(lastClickPoint);

        var marker = L.marker(lastClickPoint, { title: result[0].properties.name, alt: lastClickPoint }).addTo(map);

        var popup = L.popup({ keepInView: true }).setContent(result[0].properties.name);

        marker.bindPopup(popup).openPopup();

        g_GlobalStaticNumber.marker.addLayer(marker);


        $('.single-item').slick('unslick');
        $('.single-item').html('<div><a href=' + result[0].properties.folder + '1.jpg data-lightbox=' + result[0].properties.name + '><img src=' + result[0].properties.folder + '1.jpg width=100% height=100%></a></div>');
        for (var i = 2; i <= result[0].properties.amount; i++) {
            $('.single-item').html($('.single-item').html() + '<div><a href=' + result[0].properties.folder + i + '.jpg data-lightbox=' + result[0].properties.name + '><img src=' + result[0].properties.folder + i + '.jpg width=100% height=100%></a></div>');
        };
        $('.single-item').slick({
            autoplay: true
        });





    }



}