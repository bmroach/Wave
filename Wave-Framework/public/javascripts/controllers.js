angular.module('Wave', [])

    .controller('waveCtrl', function ($scope, $http, $location) {
        $scope.initApp = function(){}

        $scope.callApis = function () {
            var request = {
               method: 'post',
               url: 'http://localhost:3000/callApis/' ,
               data: {
                   'query': $scope.Query,
                   'startDate': $scope.startDate,
                   'endDate': $scope.endDate
                }
            }

            console.log(request.data.query)
            console.log(request.data.startDate)
            console.log(request.data.endDate)
            console.log('internal api called')
            $http(request)
                .then(function (res) {
                        console.log(res.data)
                        $scope.fromAPIs = res.data
                    }
                )
        }
        $scope.checkAll = function(emotions){
            console.log("check called")
            if(emotions.hasOwnProperty(all)){
                console.log("YPUI")
                return true
            } else {
                return false
            }
        }

    }) 