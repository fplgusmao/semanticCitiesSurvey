(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .run(pointMultiplePlacesRun);

    pointMultiplePlacesRun.$inject = ['routerHelper'];

    /* @ngInject */
    function pointMultiplePlacesRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state : 'point-multiple-places',
                config : {
                    url : '/step{phaseId:int}/point-multiple-places',
                    templateUrl : 'app/map-interactions/' +
                                  'point-multiple-places/' +
                                  'point-multiple-places.html',
                    controller : 'PointMultiplePlacesController',
                    controllerAs : 'vm',
                    title : 'Point on the map'
                }
            }
        ];
    }
})();
