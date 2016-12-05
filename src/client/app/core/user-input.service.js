(function () {
    'use strict';
    angular
        .module('scsApp.core')
        .factory('userInputService', userInputService);

    userInputService.$inject = ['$http', 'exception', 'hostPath'];

    /* @ngInject */
    function userInputService($http, exception, hostPath) {
        /**
         * Keeps a local copy of all user input for the current survey.
         * This input can be directly reloaded into the survey, if needed
         * (e.g: visiting a sub-phase again)
         */
        var reloadableRegistry = [];

        /**
         * Keeps a local copy of all user input for the current survey.
         * For some phases, it keeps a serializable version of its input,
         * allowing it to be sent to a database.
         */
        var registry = [];

        var userId;
        var phpRoot = hostPath + 'db/';

        var exports = {
            submitUserInput : submitUserInput,
            getUserInput : getUserInput
        };

        activate();

        return exports;

        ////////////////

        function activate() {
            $http.post(phpRoot + 'register-user.php').
            then(function(response) {
                //gets id to then save the input
                userId = parseInt(response.data);

                if (typeof(userId) !== 'number') {
                    userId = undefined;
                    return;
                }
            }).catch(function(e) {
                exception.catcher('Failed to register user participation')(e);
            });
        }

        /**
         * Saves the user input for a certain survey step, and proceeds to
         * submit all the registered input, so far, to a database.
         * @param {Object} phaseInput     User's input in the given phase.
         * @param {number} phaseNumber    Number of the phase.
         * @param {number} subPhaseNumber Number of the sub-phase, if
         *                                currently in one.
         */
        function submitUserInput(phaseInput, phaseNumber, subPhaseNumber) {
            if (typeof(phaseInput) === 'undefined') {
                //if it wasn't provided any input
                return;
            }

            if (angular.isNumber(subPhaseNumber)) {
                registerSubPhaseInput(phaseInput,
                                      phaseNumber,
                                      subPhaseNumber);
            } else {
                registerPhaseInput(phaseInput, phaseNumber);
            }

            storeInDatabase();
        }

        /**
         * Returns the user previous input on a given survey phase.
         * @param   {number} phaseNumber    Number of the phase.
         * @param   {number} subPhaseNumber Number of the sub-phase, if
         *                                  currently in one.
         * @returns {Object} Existing user input in the given phase.
         *                   If there is no previous input, then this function
         *                   returns an empty object
         */
        function getUserInput(phaseNumber, subPhaseNumber) {
            if (typeof(registry[phaseNumber]) ===
                'undefined') {
                registry[phaseNumber] = {};
            }

            if (typeof(subPhaseNumber) === 'number') {
                //if getting a sub phase's input

                if (typeof(registry[phaseNumber]) === 'undefined') {
                    //if there are no registered sub-phases yet
                    registry[phaseNumber] = {};
                }

                if (typeof(registry[phaseNumber][subPhaseNumber]) ===
                    'undefined') {
                    //if sub-phase input object is not initialized
                    registry[phaseNumber][subPhaseNumber] = {};
                }

                return registry[phaseNumber][subPhaseNumber];
                //if you know a better way to do this, please do it
            } else {
                return registry[phaseNumber];
            }
        }

        //////////////// - helpers

        function registerPhaseInput(input, phaseNumber) {
            registry[phaseNumber] = input;
        }

        function registerSubPhaseInput(input, phaseNumber, subPhaseNumber) {
            registry[phaseNumber][subPhaseNumber] = input;
        }

        /**
         * Stores the registered user input in a database
         */
        function storeInDatabase() {
            var registryInJSON = angular.toJson(registry);
            $http.post(phpRoot + 'save-user-participation.php', {
                userId : userId,
                userParticipation : registryInJSON
            }).
            then(function (response) {
                var d = angular.fromJson(response.data[userId - 3]);
                var p = d ? angular.fromJson(d.participation) : undefined;
            }).
            catch(function (e) {
                return exception.catcher(
                    'Failed to submit user input')(e);
            });
        }
    }
})();
