/**
 * Created by renerodriguez on 11/10/14.
 */
var app = angular.module("CRS");


app.controller("GeoJSONController", ['$scope', '$rootScope', 'dataFactory','GeoJSONLayers',
    function ($scope, $rootScope, dataFactory, GeoJSONLayers) {

        getFarms();

        var layers = [];

        function getFarms() {
            dataFactory.getFarms()
                .success(function (data) {
                    angular.extend($scope, {
                        geojson: {
                            data: data,
                            pointToLayer: function(feature, latlng){
                                return L.circleMarker(latlng, style());
                            },
                            resetStyleOnMouseout: true
                        }
                    });
                    layers.push(data);

                })
                .error(function (error) {
                    $scope.status = 'Unable to load observation data: ' + error.message;
                });
        }

        getDistrictsWithFarms();

        function getDistrictsWithFarms() {
            dataFactory.getDistrictsWithFarms()
                .success(function (data) {
                    angular.extend($scope, {
                        geojson: {
                            data: data,
                            style: {
                                fillColor: "green",
                                weight: 2,
                                opacity: 1,
                                color: 'white',
                                dashArray: '3',
                                fillOpacity: 0.7
                            }
                        }
                    });
                    layers.push(data);
//                    addLayersToMap();

                    console.log(layers);

                })
                .error(function (error) {
                    $scope.status = 'Unable to load observation data: ' + error.message;
                });
        }



//        function addLayersToMap(){
//
//            console.log(layers);
//            angular.extend($scope, {
////                        geojson: {
////                            data: layers[0],
////                            data2: layers[1]
////                        }
//                           geojson:{
//                               farms: {
//                                   name: "farms",
//                                   data: layers[0]
//                               },
//                               districts: {
//                                   name: "districts",
//                                   data: layers[1]
//                               }
//
//                           }
//                    });
//
//        }

        function style(feature) {
            return {
                radius: 4,
                fillColor: "#f7685c",
                color: "#c24138",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            };
        }

        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
            obsClick(featureSelected, leafletEvent);
        });

        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, leafletEvent) {
            obsMouseover(leafletEvent);
        });

        $scope.$on("leafletDirectiveMap.geojsonMouseout", function(ev, leafletEvent) {
            obsMouseout(leafletEvent);
        });


        angular.extend($scope, {
            seattle: {
                lat: 25.611,
                lng: 85.144,
                zoom: 6
            },
            tiles: {
                url: "https://{s}.tiles.mapbox.com/v3/americanredcross.hcji22de/{z}/{x}/{y}.png"
            },
            defaults: {
                scrollWheelZoom: false
            },
            layers: {
                districts:{
                    name:'districts',
                    type: 'geoJSON',
                    url:'http://tile.openstreetmap.us/vectiles-buildings/{z}/{x}/{y}.json',
                    layerOptions: {
                        style: {
                            "color": "#00D",
                            "fillColor": "#00D",
                            "weight": 1.0,
                            "opacity": 0.6,
                            "fillOpacity": .2
                        }
                    }

                },
            farms: {
                name:'farms',
                type: 'geoJSON',
                url:'http://tile.openstreetmap.us/vectiles-buildings/{z}/{x}/{y}.json',
                layerOptions: {
                    style: {
                        "color": "#00D",
                        "fillColor": "#00D",
                        "weight": 1.0,
                        "opacity": 0.6,
                        "fillOpacity": .2
                    }
                }

            }
            }
        });

        function obsClick(observation, event) {
            console.log(observation.properties.comment);


        }

        // Mouse over function, called from the Leaflet Map Events
        function obsMouseover(leafletEvent) {
            var layer = leafletEvent.target;
            layer.setStyle({
                radius: 10,
                fillColor: "#f7685c",
                color: "#c24138",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            });
            layer.bringToFront();

            putComment(layer.feature.properties.target_id);

            console.log(layer.feature.properties.target_id);
        }

        function obsMouseout(leafletEvent) {
            var layer = leafletEvent.target;
            layer.setStyle({
                radius: 4,
                fillColor: "#f7685c",
                color: "#c24138",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            });

        }

        function putComment(text){

            $rootScope.obsText = text;


        }











    }]);

