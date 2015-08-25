(function() {
    /**
     * MyToiletApp Module
     *
     * Description
     */
    angular
        .module('myToiletApp')
        .controller('LocationMapListViewCtrl', LocationMapListView);

    LocationMapListView.$inject = ['$scope', 'LocationFactory', '$ionicLoading', '$rootScope'];

    function LocationMapListView($scope, location, $ionicLoading, $rootScope) {

        var vm = this;

        vm.map = {};
        vm.markersOriginalCopy = [];
        vm.getArrayOfRating = getArrayOfRating;
        vm.hasData = true;

        $scope.$on('sorted', sortToiletItem);
        var searchClicked = $rootScope.$on('searchClicked', function (event, query) {
            // Also check for user last location is updated and also update the map.
            drawMarkersForListView($scope.locationsearch);
        });

        $scope.$on('$destroy', function () {
            searchClicked();
        });

        $scope.mta.showLoader();

        /**
         * getNameOfMyLocation method return the name of current location.
         * @return {[type]} [description]
         */
        function getNameOfMyLocation() {
            location.reverseGeoCoding(location.addressComponent.locality1).then(function(response) {
                drawMarkersForListView(response.results.longName);
            });
        }

        /**
         * getArrayOfRating method convert the rating number to array item.
         * This item will be used by ng-repeat.
         * @return {[type]} [description]
         */
        function getArrayOfRating(length, deductBy) {
            deductBy = deductBy || 0;
            length = deductBy - parseInt(length);
            if (length === 0) return null;
            var arr = [];
            _.forEach(new Array(length), function(value, index) {
                arr.push(index);
            });

            return arr;
        }


        /**
         * drawMarkersForListView methods draw all the markers in the user map.
         * @return {type} [description]
         */
        function drawMarkersForListView(curLocation) {
            var distance;

            // location.getAllLocations(curLocation).then(function(response) {
            location.getAllLocations('hauz khas').then(function(response) {
                // No data found message should, be displayed
                if (response.data.length === 0) {
                    $ionicLoading.hide();
                    vm.hasData = false;
                    return;
                }

                // Cache the locations in service..
                location.list = response.data;
                distance = location.distanceCalculator([location.coordinate], location.list);
                distance.then(function(distance) {
                    vm.markersOriginalCopy = distance;
                    vm.map.markers = distance;
                    vm.map.curLocation = location.coordinate;
                    $scope.$apply();
                    $ionicLoading.hide();
                });
            });
        }

        /**
         * sortToiletItem method get called when user click on footer menu bar.
         * It sorts the current list of toilets.
         * @param  {Object} event [description]
         * @param  {string} sortedBy  selected toilet mode.
         * @return {[type]}       [description]
         */
        function sortToiletItem(event, sortedBy) {
            vm.map.markers = [];
            vm.map.markers.push(
                _.find(vm.markersOriginalCopy, function(marker) {
                    return (marker.mode === sortedBy);
                }));

            // $scope.$apply();
        }


        getNameOfMyLocation();

    }

})();