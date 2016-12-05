/**
 * Survey Data Service
 */
(function () {
    'use strict';

    angular
        .module('scsApp.core')
        .factory('surveyDataService', surveyDataService);

    surveyDataService.$inject = ['$http', 'exception', '$q', 'hostPath'];

    /**
     * @desc A service to provide the needed survey data.
     */
    /* @ngInject */
    function surveyDataService($http, exception, $q, hostPath) {
        var dataRoot = hostPath + 'data/';
        var phaseCache = [];
        var configCache = [];
        var exports = {
            getPhaseData : getPhaseData,
            getSubPhaseData: getSubPhaseData
        };

        return exports;

        ////////////////

        /**
         * @name getPhaseData
         * @desc Retrieves the survey data for a given phase.
         * @param {number} phaseNumber The phase's number
         * @returns {Object} If successful, returns a promise of
         *                   the phase data. If it fails, throws an
         *                   exception.
         */
        function getPhaseData(phaseNumber) {
            if (angular.isUndefined(phaseCache) ||
                angular.equals({}, phaseCache) ||
                phaseCache.length === 0) {
                return $http.get(dataRoot + 'survey-data.json')
                    .then(success)
                    .catch(fail);
            } else {
                return $q.when(phaseCache[phaseNumber] || {}); //wrap in a promise
            }

            function success(response) {
                phaseCache = response.data;
                return $q.when(phaseCache[phaseNumber] || {});
            }

            function fail(error) {
                return exception
                    .catcher('Could not fetch phase data')(error);
            }
        }

        function getSubPhaseData(phaseNumber, subPhaseNumber) {
            if (angular.isUndefined(phaseCache) ||
                angular.equals({}, phaseCache)) {
                return $http.get(dataRoot + 'survey-data.json')
                    .then(success)
                    .catch(fail);
            } else {
                if (hasSubPhase(phaseCache, phaseNumber, subPhaseNumber)) {
                    var phaseData = phaseCache[phaseNumber];
                    return $q.when(phaseData.subPhases[subPhaseNumber].phaseData); //wrap in a promise
                }

                return $q.when({}); //wrap in a promise
            }

            function success(response) {
                phaseCache = response.data;

                if (hasSubPhase(phaseCache, phaseNumber, subPhaseNumber)) {
                    var phaseData = phaseCache[phaseNumber];
                    return $q.when(phaseData.subPhases[subPhaseNumber] || {}); //wrap in a promise
                }

                return $q.when({}); //wrap in a promise
            }

            function fail(error) {
                return exception
                    .catcher('Could not fetch phase data')(error);
            }

            function hasSubPhase(allPhases, pN, spN) {
                return angular.isObject(allPhases[pN]) &&
                    angular.isArray(allPhases[pN].subPhases) &&
                    angular.isObject(allPhases[pN].subPhases[spN]) &&
                    angular.isObject(allPhases[pN].subPhases[spN].phaseData);
            }
        }
    }
})();
