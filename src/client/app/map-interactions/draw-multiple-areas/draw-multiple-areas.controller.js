(function() {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .controller('DrawMultipleAreasController', DrawMultipleAreasController);

    DrawMultipleAreasController.$inject = ['userProgressService',
                                           'mapService', '$scope'];

    /* @ngInject */
    function DrawMultipleAreasController(userProgressService,
                                          mapService, $scope) {
        var vm = this;
        vm.areasToDraw = [];
        vm.drawnAreas = {};

        vm.drawArea = drawArea;
        vm.userDrew = userDrew;

        activate();

        ////////////////

        function activate() {
            userProgressService.getCurrentPhaseData().
            then(function(data) {
                vm.areasToDraw = data.subPhases;
                var existingInput =
                    userProgressService.getExistingUserInput();

                if (existingInput &&
                    !angular.equals(existingInput, {})) {
                    vm.drawnAreas = existingInput;
                }

                vm.mapView = data.mapView;

                mapService.loadMap(vm.mapView);

                vm.interactionTitle = data.title;
                vm.interactionDescription = data.description;
                vm.interactionInstructions = data.instructions;

                //watch changes in userProgressService's registered input
                $scope.$watch(
                    function($scope) {
                        return (userProgressService.getExistingUserInput());
                    },
                    regulateInput
                );

                /**
                 * Due to the current structure, draw-multiple-areas' input
                 * can be corrupted by a draw-area's phase onDestroy behaviour.
                 * This function checks if the input is corrupted and replaces
                 * the corrupt input by the correct one.
                 * @param {object} registeredUserInput User input currently
                 *                                     registered in
                 *                                     userProgressService
                 */
                function regulateInput(registeredUserInput) {
                    if (!angular.equals(vm.drawnAreas, registeredUserInput)) {
                        //user input in userProgressService is corrupted
                        userProgressService.saveUserInput(vm.drawnAreas);
                    }
                }
            });
        }

        function drawArea(areaNumber) {
            vm.drawnAreas[areaNumber] = {};
            userProgressService.saveUserInput(vm.drawnAreas);
            userProgressService.goToSubPhase(areaNumber);
        }

        function userDrew(area) {
            var areaWasExplored =
                typeof(vm.drawnAreas[area]) !== 'undefined';

            var areaWasDrawn = !angular.equals(vm.drawnAreas[area], {});

            return areaWasExplored && areaWasDrawn;
        }
    }
})();
