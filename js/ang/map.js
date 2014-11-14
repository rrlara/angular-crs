/**
 * Created by renerodriguez on 11/11/14.
 */
var app = angular.module("CRS");

app.controller("MapController", ['$scope', '$rootScope', 'dataFactory',
    function ($scope, $rootScope, dataFactory) {


        console.log($rootScope.globalParams);

        $scope._districtsWithFarms = null;

        $scope._districtsBoundaries = null;

        $scope._districtLayerOutline = null;

        $scope.FarmsPoints = null;


        var map = L.map('map');



        var basemapUrl = "https://{s}.tiles.mapbox.com/v3/americanredcross.hcji22de/{z}/{x}/{y}.png";
        basemapLayer = L.tileLayer(basemapUrl);
        basemapLayer.addTo(map);

//        map.setView([25.611, 85.144], 7);

        map.scrollWheelZoom = false;

        map.invalidateSize(true);

        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };




        var layers = null;

        $scope.getFarmsPoints = function getFarms(croptype) {
            dataFactory.getFarms()
                .success(function (data) {

                    $scope.FarmsPoints = L.geoJson(data, {
                        pointToLayer: function (feature, latlng) {
                            return L.circleMarker(latlng, geojsonMarkerOptions);
                        }
                    }).addTo(map);

                })
                .error(function (error) {
                    $scope.status = 'Unable to load observation data: ' + error.message;
                });
        }

        function style(feature) {
            return {
                fill: getFillColor(feature.properties.has_farms),
                fillColor: getColor(feature.properties.has_farms),
                weight: 2,
                opacity: 1,
                color: 'gray',
                fillOpacity: 0.6

            };
        }

        function getColor(d) {
            //console.log(d);
            if (d == true) {
                return '#FEB24C';
            } else {
                return '#FED976';
            }
        }

        function getFillColor(d) {
            //console.log(d);
            if (d == true) {
                return true;
            } else {
                return false;
            }
        }

        function onEachFeature(feature, layer) {

        }

        function getDistrictsWithFarms() {
            dataFactory.getDistrictsWithFarms()
                .success(function (data) {

                    $scope._districtsBoundaries = data;

                    addOutlineDistrictsBoundaries();

                    $scope._districtsWithFarms = L.geoJson(data, {
                        filter: function(feature, layer) {
                            return feature.properties.has_farms;
                        },
                        style: style,
                        onEachFeature: onEachFeature
                    }).addTo(map);

                })
                .error(function (error) {
                    $scope.status = 'Unable to load observation data: ' + error.message;
                });
        }

        function addOutlineDistrictsBoundaries(){

            //console.log("outlined boundaries")
            function style(feature) {
                return {
                    weight: 1,
                    fill: false,
                    color: 'gray',
                    dashArray: '3',
                };
            }

            $scope._districtLayerOutline = L.geoJson($scope._districtsBoundaries, {style: style}).addTo(map);

            map.fitBounds( $scope._districtLayerOutline,{
                padding: [0, 0]
            });


        }





        getDistrictsWithFarms();


        $scope.items = ['District Level', 'Individual Plot'];
        $scope.selected = $scope.items[0];

        $scope.select= function(item) {
            $scope.selected = item;

            console.log(item);


            if (item === "Individual Plot"){

                if ($scope.FarmsPoints){
                    map.addLayer($scope.FarmsPoints);
                    map.removeLayer($scope._districtsWithFarms);
                }else{
                    $scope.getFarmsPoints();
                    map.removeLayer($scope._districtsWithFarms);
                }

            }else if (item === "District Level" ){

                if ($scope._districtsWithFarms){
                    map.addLayer($scope._districtsWithFarms);
                    map.removeLayer($scope.FarmsPoints);
                }else{

                    map.removeLayer($scope.FarmsPoints);
                }

            }



//            if (item === "Individual Plot" && $scope.FarmsPoints === null ){
//                $scope.getFarmsPoints();
//                map.removeLayer($scope._districtsWithFarms);
//            }else{
//                map.addLayer($scope.FarmsPoints);
//                map.removeLayer($scope._districtsWithFarms);
//            }

//            if (item === "District Level" && $scope._districtsWithFarms != null ){
//                map.removeLayer($scope.FarmsPoints);
//            }else{
//                map.addLayer($scope._districtsWithFarms);
//                map.removeLayer($scope.FarmsPoints);
//            }


        };

        $scope.itemClass = function(item) {

//            console.log(item);


            return item === $scope.selected ? 'active1' : undefined;

        };









    }]);