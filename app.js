var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, myService) {
    var eventDatas = [];
    $scope.currentEventDatas = [];

    $scope.eventContainers = new Array(24);
    $scope.times = myService.getTimes();

    $scope.onClickToday = function() {
        if (+$scope.currentDate.setHours(0, 0, 0, 0) === +new Date().setHours(0, 0, 0, 0))
            return;

        $scope.currentDate = new Date();
        $scope.currentEventDatas = myService.getCurrentDayDatas($scope.currentDate, eventDatas);
    };
    
    $('.event-container').on('mouseover','.event-details',function(){
        console.log('mouseover');
    });

    $scope.previousDay = function() {
        $scope.currentDate.addDays(-1);
        $scope.currentEventDatas = myService.getCurrentDayDatas($scope.currentDate, eventDatas);
    };

    $scope.nextDay = function() {
        $scope.currentDate.addDays(1);
        $scope.currentEventDatas = myService.getCurrentDayDatas($scope.currentDate, eventDatas);
    };

    $scope.onMouseOver = function() {        
        angular.element(this).addClass('highlight-event');
    };

    $scope.onMouseLeave = function() {
        angular.element(this).removeClass('highlight-event');
    };

    $scope.getEventTime = function(date) {
        if (date)
            return new Date(date);
    };

    $scope.getEventDatas = function() {
        $scope.currentDate = new Date();
        myService.get().then(function(data) {
            eventDatas = data.data;
            $scope.currentEventDatas = myService.getCurrentDayDatas(new Date(), eventDatas);
        });
    };
});

app.service('myService', function($http) {
    var api = {};
    api.get = function() {
        return $http.get('sample-data.json');
    };
    api.getTimes = function() {
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
    api.getCurrentDayDatas = function(currentDate, allEventDatas) {
        console.time('exec');
        currentDate.setHours(0, 0, 0, 0);
        var currentDayDatas = allEventDatas.filter(function(data) {
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
                if(data.height<=30 && data.height>15){
                    data.fontSize = '11px';
                }else if(data.height<=15){
                    data.fontSize = '9px';
                }else{
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

Date.prototype.addDays = function(n) {
    var time = this.getTime();
    var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    this.setTime(changedDate.getTime());
    return this;
};


