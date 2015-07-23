/*
 * filename: app.js
 * author: gopi
 * created_at: 22-7-15
 * description: created myApp module to run Angular app, consist of myCtrl (controller) and myService (service)
 */

"use strict";

var app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, myService) {
    var eventDatas = [];
    $scope.currentEventDatas = [];

    $scope.eventContainers = new Array(24);
    $scope.times = myService.getTimes();

    /* function to run on click of today button  */
    $scope.onClickToday = function () {
        if (+$scope.currentDate.setHours(0, 0, 0, 0) === +new Date().setHours(0, 0, 0, 0))
            return;

        $scope.currentDate = new Date();
        $scope.currentEventDatas = myService.getCurrentDayDatas($scope.currentDate, eventDatas);
    };

    /* function to run on click of '<' button  */
    $scope.previousDay = function () {
        $scope.currentDate.addDays(-1);
        $scope.currentEventDatas = myService.getCurrentDayDatas($scope.currentDate, eventDatas);
    };

    /* function to run on click of '>' button  */
    $scope.nextDay = function () {
        $scope.currentDate.addDays(1);
        $scope.currentEventDatas = myService.getCurrentDayDatas($scope.currentDate, eventDatas);
    };

    /* function to update time for events in UI  */
    $scope.getEventTime = function (date) {
        if (date)
            return new Date(date);
    };

    /* function to call on ng-init */
    $scope.getEventDatas = function () {
        $scope.currentDate = new Date();
        myService.get().then(function (data) {
            eventDatas = data.data;
            $scope.currentEventDatas = myService.getCurrentDayDatas(new Date(), eventDatas);
        });
    };
});

app.service('myService', function ($http) {
    var api = {};
    /* function get the sample-data json file using $http */
    api.get = function () {
        return $http.get('sample-data.json');
    };
    /* function to output hours in UI  */
    api.getTimes = function () {
        var times = [];
        for (var i = 1; i <= 23; i++) {
            if (i < 12) {
                times.push(i + ' AM');
            }
            else if (i === 12) {
                times.push('12 PM');
            } else {
                times.push((i - 12) + ' PM');
            }
        }
        times.unshift('12 AM');
        times.push('12 PM');
        return times;
    };
    /* function to filter the current date events */
    api.getCurrentDayDatas = function (currentDate, allEventDatas) {
        console.time('exec');
        currentDate.setHours(0, 0, 0, 0);
        var currentDayDatas = allEventDatas.filter(function (data) {
            //debugger
            var date = new Date(data.startTime);
            var temp = new Date(data.startTime);
            temp.setHours(0, 0, 0, 0);
            if (+currentDate === +temp) {
                data.marginTop = date.getHours() * 60;
                data.marginTop += date.getMinutes();
                var endDate = new Date(data.endTime);
                data.height = endDate.getHours() * 60;
                data.height += endDate.getMinutes();
                data.height -= data.marginTop;
                if (data.height <= 30 && data.height > 15) {
                    data.fontSize = '11px';
                } else if (data.height <= 15) {
                    data.fontSize = '9px';
                } else {
                    data.fontSize = 'inherit';
                }
                return data;
            }
        });
        console.timeEnd('exec');
        return currentDayDatas;
    };
    return api;
});

/* extending Date object to get previous and next days */
Date.prototype.addDays = function (n) {
    var time = this.getTime();
    var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    this.setTime(changedDate.getTime());
    return this;
};


