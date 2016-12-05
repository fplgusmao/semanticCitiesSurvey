/*jshint bitwise: false*/
(function() {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .controller('DrawAreaController', DrawAreaController);

    DrawAreaController.$inject = ['userProgressService',
                                  'mapService',
                                  'LeafletFreeDraw'];

    /* @ngInject */
    function DrawAreaController(userProgressService,
                                 mapService,
                                 LeafletFreeDraw) {
        var modes = {
            createMode : LeafletFreeDraw.MODES.CREATE |
                LeafletFreeDraw.MODES.EDIT |
                LeafletFreeDraw.MODES.VIEW,
            deleteMode : LeafletFreeDraw.MODES.DELETE |
                LeafletFreeDraw.MODES.EDIT |
                LeafletFreeDraw.MODES.VIEW,
            moveMode : LeafletFreeDraw.MODES.VIEW |
                LeafletFreeDraw.MODES.EDIT
        };
        var activeMode = modes.moveMode;

        var drawingsManager;
        var drawingsManagerId;
        var drawingsConfig = {
            initialMode : {mode : modes.moveMode},
            smoothFactor : 5,
            createAndExit : false
        };

        var drawnPolygons = [];
        var drawnSomething = false;

        var vm = this;

        vm.toggleDrawingMode  = toggleDrawingMode;
        vm.toggleDeletingMode = toggleDeletingMode;
        vm.toggleMovingMode   = toggleMovingMode;

        vm.isDrawing  = isDrawing;
        vm.isDeleting = isDeleting;
        vm.isMoving   = isMoving;

        activate();

        ////////////////

        function activate() {
            userProgressService.getCurrentPhaseData().
            then(function(data) {
                vm.mapView = data.mapView;
                setupDrawingOn(vm.mapView);

                vm.interactionTitle = data.title;
                vm.interactionDescription = data.description;
                vm.interactionInstructions = data.instructions;
            });
        }

        function toggleDrawingMode() {
            if (typeof(drawingsManager) === 'undefined') {
                return;
            }

            if (vm.isDrawing()) {
                drawingsManager.setMode(modes.moveMode);
                activeMode = modes.moveMode;
            } else {
                drawingsManager.setMode(modes.createMode);
                activeMode = modes.createMode;
            }
        }

        function toggleDeletingMode() {
            if (typeof(drawingsManager) === 'undefined') {
                return;
            }

            if (vm.isDeleting()) {
                drawingsManager.setMode(modes.moveMode);
                activeMode = modes.moveMode;
            } else {
                drawingsManager.setMode(modes.deleteMode);
                activeMode = modes.deleteMode;
            }
        }

        function toggleMovingMode() {
            if (typeof(drawingsManager) === 'undefined') {
                return;
            }

            drawingsManager.setMode(modes.moveMode);
            activeMode = modes.moveMode;
        }

        function isDrawing() {
            return (typeof(drawingsManager) !== 'undefined') &&
                activeMode === modes.createMode;
        }

        function isDeleting() {
            return (typeof(drawingsManager) !== 'undefined') &&
                activeMode === modes.deleteMode;
        }

        function isMoving() {
            return (typeof(drawingsManager) !== 'undefined') &&
                activeMode === modes.moveMode;
        }

        ////////////////

        /**
         * Setups the different needed components to provide
         * the free drawing functionality on the given map, reloading
         * any previous drawn polygons and adding them to them map.
         *
         * @param {Object} map Describes the view of the map
         *                     on which the user should draw.
         */
        function setupDrawingOn(map) {
            drawingsManager =
                new LeafletFreeDraw(drawingsConfig.initialMode);

            drawingsManager.setSmoothFactor =
                drawingsConfig.smoothFactor;

            drawingsManager.options.exitModeAfterCreate(
                drawingsConfig.createAndExit
            );

            drawingsManager.on(
                'markers',
                drawingsSaver(drawnPolygons, drawnSomething)
            );

            mapService.loadMap(map).
            then(function() {
                drawingsManagerId =
                    mapService.addToMap(drawingsManager);

                loadPreviouslyDrawnPolygons();
            });
        }

        /**
         * Generates a callback function to save drawn polygons.
         * @param   {Array}    polygons Array where the new polygon
         *                              set will be saved to.
         * @param   {Boolean}  notifier A flag to represent the
         *                              existence of drawn polygons.
         * @returns {Function} Function that saves the drawn polygons
         */
        function drawingsSaver(polygons, notifier) {
            return function(eventData) {
                notifier = drawingsManager.polygonCount > 0;
                polygons = eventData.latLngs;
                userProgressService.saveUserInput(polygons);
            };
        }

        function loadPreviouslyDrawnPolygons() {
            drawnPolygons =
                userProgressService.getExistingUserInput();

            if (typeof(drawnPolygons) === 'undefined' ||
                angular.equals(drawnPolygons, {})) {
                drawnPolygons = [];
                return;
            }

            drawnPolygons.forEach(function(polygon) {
                drawingsManager.createPolygon(polygon);
            });
        }
    }
})();
