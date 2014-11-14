/**
 * Created by renerodriguez on 11/10/14.
 */
var app = angular.module("CRS");


app.controller("mainCrtl", ['$scope', '$rootScope', 'dataFactory',
    function ($scope, $rootScope, dataFactory) {


    $rootScope.globalParams ={
        yearClicked: "2014",
        seasonClicked: "rabi",
        cropTypeClicked: ["rice"]
    }

    $rootScope.district_Farm = {
        districtName: "",
        farmsID: ""
    }

    }]);

