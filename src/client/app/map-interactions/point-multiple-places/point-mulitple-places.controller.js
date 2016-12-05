(function() {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .controller('PointMultiplePlacesController',
                    PointMultiplePlacesController);

    PointMultiplePlacesController.$inject = ['userProgressService',
                                             'mapService',
                                             'leaflet'];

    /* @ngInject */
    function PointMultiplePlacesController(userProgressService,
                                           mapService,
                                           leaflet) {
        var vm = this;
        var placedMarkers = [];

        activate();

        ////////////////

        function activate() {
            userProgressService.getCurrentPhaseData().
            then(function(data) {
                vm.markerRadius = data.markerRadius;
                vm.markerDetails = data.markerDetails;
                vm.mapView = data.mapView;

                setupMultipleMarkerPlacementOn(vm.mapView);

                vm.interactionTitle = data.title;
                vm.interactionDescription = data.description;
                vm.interactionInstructions = data.instructions;
            });
        }

        /**
         * Setups the map and its event callbacks in order to enable
         * the "point multiple places" interaction, which allows the
         * user to place a pre-configured circle on the given map.
         * @param {Object} map Object containing all the needed
         *                     information to initialize a leaflet
         *                     map ready for user input.
         */
        function setupMultipleMarkerPlacementOn(map) {
            mapService.loadMap(map).
            then(function() {
                //loadPreviousInput();

                mapService
                    .addMapInteraction('click', placeMarker);
            });
        }

        /**
         * Click callback for the "marker placement" interaction.
         * @param {Object} e Click event data.
         */
        function placeMarker(e) {
            var marker = new leaflet.circle(e.latlng,
                                            vm.markerRadius,
                                            vm.markerDetails);
            mapService.addToMap(
                marker,
                function() { //onCLick interaction
                    mapService.removeFromMap(marker);
                }
            );

            placedMarkers.push(marker);
            userProgressService.saveUserInput(
                placedMarkers,
                mapService.getSerializableUserInput()
            );
        }

        /**
         * Checks if there's any saved input and reloads it into the
         * map.
         */
        function loadPreviousInput() {
            placedMarkers =
                userProgressService.getExistingUserInput();

            if (angular.equals(placedMarkers, {}) ||
                angular.equals(placedMarkers, []) ||
                typeof(placedMarkers) === 'undefined') {
                placedMarkers = [];
                return;
            }

            placedMarkers.forEach(function(marker) {
                mapService.addToMap(
                    marker,
                    function() {
                        mapService.removeFromMap(marker);
                    }
                );
            });
        }
    }
})();
