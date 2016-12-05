(function() {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .controller('PointAPlaceController', PointAPlaceController);

    PointAPlaceController.$inject = ['userProgressService',
                                     'mapService',
                                     'leaflet'];

    /* @ngInject */
    function PointAPlaceController(userProgressService,
                                   mapService,
                                   leaflet) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            userProgressService.getCurrentPhaseData().
            then(function(data) {
                vm.markerRadius = data.markerRadius;
                vm.markerDetails = data.markerDetails;

                vm.mapView = data.mapView;

                setupExclusiveMarkerPlacementOn(vm.mapView);

                vm.interactionTitle = data.title;
                vm.interactionDescription = data.description;
                vm.interactionInstructions = data.instructions;
            });
        }

        /**
         * Setups the map and its event callbacks in order to enable
         * the "point a place" interaction, which allows the user to
         * place a pre-configured circle on the given map.
         * @param {Object} map Object containing all the needed
         *                     information to initialize a leaflet
         *                     map ready for user input.
         */
        function setupExclusiveMarkerPlacementOn(map) {
            mapService.loadMap(map).
            then(function() {
                //loadPreviousInput();

                mapService
                    .addMapInteraction('click', placeMarker);
            });
        }

        /**
         * Click callback for the "single marker placement" interaction.
         * @param {Object} e Click event data.
         */
        function placeMarker(e) {
            if (mapService.hasUserInput()) {
                //there can only be one circle marker at a time
                mapService.removeAllFromMap();
            }

            var marker = new leaflet.circle(e.latlng,
                                            vm.markerRadius,
                                            vm.markerDetails);
            mapService.addToMap(
                marker,
                mapService.undoLastAddition //onClick interaction
            );

            userProgressService.saveUserInput(
                marker,
                mapService.getSerializableUserInput()
            );
        }

        /**
         * Checks if there's any saved input and reloads it into the
         * map.
         */
        function loadPreviousInput() {
            var existingMarker =
                userProgressService.getExistingUserInput();

            if (angular.equals(existingMarker, {}) ||
                typeof(existingMarker) === 'undefined') {
                //if there's no previous user input
                return;
            }

            mapService.addToMap(
                existingMarker,
                mapService.undoLastAddition //onClick interaction
            );
        }
    }
})();
