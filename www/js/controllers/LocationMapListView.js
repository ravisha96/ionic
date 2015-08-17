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

        var vm = this;

        vm.map = {};
        vm.markersOriginalCopy = [];

        $scope.$on('sorted', sortToiletItem);
        $scope.$on('locationsearch', locationsearch);
        $scope.mta.showLoader();

        /**
         * getNameOfMyLocation method return the name of current location.
         * @return {[type]} [description]
         */
        function getNameOfMyLocation() {
            location.reverseGeoCoding(location.addressComponent.locality1).then(function(response) {
                drawMarkersForListView(response.results);
            });
        }

        /**
         * locationsearch
         * @return {[type]} [description]
         */
        function locationsearch() {

        }


        /**
         * drawMarkersForListView methods draw all the markers in the user map.
         * @return {type} [description]
         */
        function drawMarkersForListView(curLocation) {
            var distance;

            // location.getAllLocations(curLocation.longName).then(function(response) {
            location.getAllLocations("hauz khas").then(function(response) {
                // No data found message should, be displayed
                if (response.data.length === 0) {
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
            vm.map.markers = _.find(vm.markersOriginalCopy, function(marker) {
                return (marker.mode === sortedBy);
            });

            $scope.$apply();
        }


        getNameOfMyLocation();

    }

})();