(function() {

    angular
        .module('myToiletApp')
        .controller('AddNewToiletCtrl', AddNewToiletCtrl);


    AddNewToiletCtrl.$inject = ['$scope', 'LocationFactory'];


    function AddNewToiletCtrl($scope, location) {

        location.getCurrentLocation().then(function(position) {
            $scope.map = {
                id: parseInt(Math.expm1(Math.random()).toString().slice('2')),
                zoom: 12,
                center: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                options: {
                    draggable: true
                },
                bounds: {},
                scrollwheel: false
            };

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: self.coords.latitude,
                    longitude: self.coords.longitude
                },
                options: {
                    draggable: true
                }
            };
        });

        $scope.ratingsObject = {
            iconOn: 'ion-ios-star',
            iconOff: 'ion-ios-star-outline',
            iconOnColor: 'rgb(255, 148, 28)',
            iconOffColor: 'rgb(171, 171, 171)',
            rating: 0,
            minRating: 0,
            callback: function(rating) {
                $scope.ratingsCallback(rating);
            }
        };

        $scope.ratingsCallback = function(rating) {
            console.log('Selected rating is : ', rating);
        };

        $scope.takePicture = function () {
            navigator.camera.getPicture(function(image) {
                console.log(image);
            });
        };

    }



})();