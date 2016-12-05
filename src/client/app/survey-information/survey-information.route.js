/**
 * Information Phase Route
 *
 * @desc Provides the routes to an information phase.
 */
(function () {
    'use strict';

    angular
        .module('scsApp.surveyInformation')
        .run(surveyInformationRun);

    surveyInformationRun.$inject = ['routerHelper'];

    /* @ngInject */
    function surveyInformationRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state : 'survey-information',
                config : {
                    url : '/step{phaseId:int}/info',
                    templateUrl : 'app/' +
                        'survey-information/survey-information.html',
                    controller : 'SurveyInformationController',
                    controllerAs : 'vm',
                    title : 'Information'
                }
            }
        ];
    }
})();
