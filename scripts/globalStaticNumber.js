// Whole-script strict mode syntax
"use strict";

// グローバル変数を定義する.


var g_GlobalStaticNumber = new GlobalStaticNumber();

/**
 * 初期設定
 * @constructor 
 * @classdesc グローバル変数の設定
 * 
 */
function GlobalStaticNumber() {
    ////////////////////////
    /////////定数////////////
    ////////////////////////
    // プロジェクト名.
    this.projectName = "EmmaMuraseAllStroke";
    // ホストのIPアドレス.
    this.hostName = location.host;


    //////////////////////////////
    ///////////変数///////////////////
    //////////////////////////////
    // ウインドウサイズ.
    this.windowSize = { x: 100, y: 100 };
    // 中心の緯度経度.
    this.centerLngLat = { lng: 136.93096, lat: 35.157789 };
    // 左上の緯度経度.
    this.upperLeftLngLat = { lng: 0, lat: 0 };
    // 右下の緯度経度.
    this.lowerRightLngLat = { lng: 0, lat: 0 };
    // 地図のcontextスケール.
    this.contextScale = 0;
    // 地図のfocusスケール.
    this.focusScale = 16;
    // 1pxあたりの緯度経度.
    this.lnglatPer1px = { lng: 0, lat: 0 };
    /** glueの左上位置座標(xy). */
    this.gluePositionXy = { x: 0, y: 0 };
    /** glue内側の半径(pixel) */
    this.glueInnerRadius = 125;
    /** glue外側の半径(pixel) */
    this.glueOuterRadius = 200;

    // 現在地の緯度経度.
    this.currentLat = 35.157970;
    // 現在地の経度.
    this.currentLng = 136.926685;


    this.array;

    this.marker;

    this.markerLatLng;

    this.polyline;

    this.layer;

    this.geojson;

    this.result;



}






