/**
 * Created by renerodriguez on 11/10/14.
 */
var app = angular.module('CRS')
    .factory('dataFactory', ['$http', function($http) {

        var dataFactory = {};



        dataFactory.getFarms = function () {
            var params = {
                format: "GeoJSON",
                where: "(crop='lentil' OR crop='wheat' OR crop='chickpea') AND extract(year from received_on)=2014 AND geometry is not null",
                returnGeometry: 'yes',
                returnfields: "crop,type,plot_size,received_on,district,village,target_id",
                groupby: "crop,type,plot_size,district,village,target_id",
                statsdef: "max:received_on"
            };
          var url = 'http://services.irras.in/services/tables/vw_farms_by_year/query';
          return $http({
                url: url,
                method: 'GET',
                params: params
            });
        };

        dataFactory.getDistrictsWithFarms = function () {
//            var params = {
//                format: "GeoJSON",
//                where: "1=1",
//                returnGeometry: 'yes'
//            };
//            var url = 'http://services.irras.in/services/tables/bihar_districts_with_farms/query';
//            return $http({
//                url: url,
//                method: 'GET',
//                params: params
//            });
//        };

            var url = 'data/districts.json';
            return $http({
                url: url,
                method: 'GET'
            });
        };

        return dataFactory;


    }]);
