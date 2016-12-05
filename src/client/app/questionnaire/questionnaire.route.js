/**
 * Questionnaire Route
 *
 * @desc Provides the routes to a questionnaire phase.
 */
(function () {
    'use strict';

    angular
        .module('scsApp.questionnaire')
        .run(questionnaireRun);

    questionnaireRun.$inject = ['routerHelper'];

    /* @ngInject */
    function questionnaireRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state : 'questionnaire',
                config : {
                    url : '/step{phaseId:int}/questions',
                    templateUrl : 'app/questionnaire/questionnaire.html',
                    controller : 'QuestionnaireController',
                    controllerAs : 'vm',
                    title : 'Questions'
                }
            }
        ];
    }
})();
