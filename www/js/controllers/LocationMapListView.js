(function() {
    /**
     * MyToiletApp Module
     *
     * Description
     */
    angular
        .module('myToiletApp')
        .controller('LocationMapListViewCtrl', LocationMapListView);

    LocationMapListView.$inject = ['$scope', 'LocationFactory', '$ionicLoading'];

    function LocationMapListView($scope, location, $ionicLoading) {
    	

    	$scope.mta.showLoader();

    }

})();