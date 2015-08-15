(function() {
    /**
     * MyToiletApp Module
     *
     * Description
     */
    angular
        .module('myToiletApp')
        .controller('LocationMapCtrl', LocationMap);

    LocationMap.$inject = ['$scope', 'LocationFactory', '$ionicLoading'];

    function LocationMap($scope, location, $ionicLoading) {

    	var vm = this;

    	$scope.showLoader = showLoader;


        /**
         * showLoader method displays the loading icon.
         * @return {[type]} [description]
         */
        function showLoader() {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 1
            });
        }
    }

})();