var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope,myService) {
    var eventDatas = [];
    $scope.currentEventDatas = [];
    
    $scope.eventContainers = new Array(24);
    $scope.times = myService.getTimes();
    
    $scope.getStartTime = function(startDate){        
        var date = new Date(startDate);
        return date.getMilliseconds();
    };
    
    $scope.getEventTime = function(date){
        if(date)
            return new Date(date);        
    };
    
    $scope.getEndTime = function(endDate){
        
    };
    
    myService.get().then(function(data){
        eventDatas = data.data;
        $scope.currentEventDatas = myService.getCurrentDayDatas(new Date('Sun May 24 2015 01:00:00 GMT+0530 (IST)'),eventDatas);        
        $scope.test = $scope.currentEventDatas[0];
        debugger
    });
});

app.service('myService', function($http) {
    var api = {};
    api.get = function() {                
        return $http.get('sample-data.json');
    };
    api.getTimes = function(){
        var times = [];
        for(var i=1;i<=23;i++){
            if(i<12){
                times.push(i+' AM');
            }
            else if(i===12){
                times.push('12 PM');
            }else{
                times.push((i-12)+' PM');
            }            
        }
        times.unshift('12 AM');
        times.push('12 PM');
        return times;
    };
    api.getCurrentDayDatas = function(currentDate,allEventDatas){   
       console.time('exec');
       currentDate.setHours(0,0,0,0);
       var currentDayDatas = _.filter(allEventDatas, function(data){
           var date = new Date(data.startTime);
           date.setHours(0,0,0,0);           
           return +currentDate===+date; 
       });
       console.timeEnd('exec');
       return currentDayDatas;
    };
    return api;
});

