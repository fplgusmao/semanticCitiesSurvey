(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .run(pointAPlaceRun);

    pointAPlaceRun.$inject = ['routerHelper'];

    /* @ngInject */
    function pointAPlaceRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state : 'point-a-place',
                config : {
                    url : '/step{phaseId:int}/point-a-place',
                    templateUrl : 'app/map-interactions/' +
                                  'point-a-place/point-a-place.html',
                    controller : 'PointAPlaceController',
                    controllerAs : 'vm',
                    title : 'Point on the map'
                }
            }
        ];
    }
})();
