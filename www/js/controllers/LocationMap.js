(function() {
    /**
     * MyToiletApp Module
     *
     * Description
     */
    angular
        .module('myToiletApp')
        .controller('LocationMapCtrl', LocationMap);

    LocationMap.$inject = ['$scope', 'LocationFactory', '$ionicLoading', 'Constants'];

    function LocationMap($scope, location, $ionicLoading, constants) {

        $scope.mta = {
        	showLoader: showLoader,
			sortToiletByMode: sortToiletByMode,
            mode: constants.MODE,
            view: constants.VIEW,
            selectedView: null,
			sortBy: null
        };


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

        /**
         * sortToiletByMode method sort the listed toilet based on the mode selected.
         * @param  {Object} event [description]
         * @return {[type]}       [description]
         */
        function sortToiletByMode(event) {
        	$scope.mta.sortBy = event.target.dataset.mode;
            $scope.$broadcast('sorted', event.target.dataset.mode);
        }
    }

})();