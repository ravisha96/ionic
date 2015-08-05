(function () {

    angular
        .module('myToiletApp')
        .controller('AddNewToiletCtrl', AddNewToiletCtrl);


    AddNewToiletCtrl.$inject = ['$scope', 'LocationFactory'];

    
    function AddNewToiletCtrl ($scope, location) {
        
        location.reverseGeoCoding();
        $scope.map = {
            center: {
                latitude: curLocation.coords.latitude,
                longitude: curLocation.coords.longitude
            },
            options: {
                icon:'//developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
            },
            zoom: 16
        };

    }



})();