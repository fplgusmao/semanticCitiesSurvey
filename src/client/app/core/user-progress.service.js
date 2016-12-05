(function () {
    'use strict';
    angular
        .module('scsApp.core')
        .factory('userProgressService', userProgressService);

    userProgressService.$inject = ['surveyDataService',
                                   'userInputService',
                                   '$state', '$q',
                                   'logger', 'exception'];

    /**
     * Implements the functionality to mantain the state of the
     * user's progress throughout the survey, while making the due
     * updates to both the data and the user's input registry
     */
    /* @ngInject */
    function userProgressService(surveyDataService,
                                  userInputService,
                                  $state, $q,
                                  logger, exception) {
        var AND_SAVE_INPUT = true, WITHOUT_SAVING = false;
        var loadingAPhase = false;

        /**
         * Keeps the current state of progress, including the
         * number and type of the current phase, and the user input
         * for the current phase.
         */
        var current = {
            phaseNumber : 0,
            phaseValidity : true,
            phase : {},
            userInput : {},

            //for sub-phases
            isSubPhase : false,
            subPhaseNumber : undefined,

            //for some phases
            needsToSerializeInput : false,
            serializableUserInput : undefined
        };

        /**
         * @name previousPhases
         * @desc Keeps track of the phases the user has completed
         */
        var previousPhases = [];    //array of phases' numbers

        /**
         * @name nextPhases
         * @desc Keeps track of the phases the user is yet to
         * complete
         */
        var nextPhases = [];        //array of phases' numbers

        //TODO: get rid of reloadPhase (see user-progress.service.spec)
        var exports = {
            getCurrentPhaseData     : getCurrentPhaseData,
            reloadPhase             : updateCurrentPhaseData,
            validateCurrentPhase    : function() {
                setCurrentPhaseValidity(true);
            },
            invalidateCurrentPhase  : function() {
                setCurrentPhaseValidity(false);
            },
            getCurrentPhaseValidity : getCurrentPhaseValidity,
            getExistingUserInput    : getExistingUserInput,
            saveUserInput           : registerChangesInUserInput,
            submitUserInput         : submitUserInput,
            changeSurveyPath        : changeSurveyPath,
            loadInitialPhase        : loadPhase,

            advance                 : advance,
            canAdvance              : canAdvance,
            goBack                  : goBack,
            canGoBack               : canGoBack,
            getActionNameForBack    : function() {
                return getActionName('Back');
            },
            getActionNameForAdvance : function() {
                return getActionName('Advance');
            },
            goToSubPhase            : goToSubPhase
        };

        return exports;

        ////////////////

        /**
         * Updates the kept user input for the current phase.
         * @param {Object} newUserInput User's current input in the
         *                              respective phase.
         */
        function registerChangesInUserInput(newUserInput,
                                            serializableUserInput) {
            current.userInput = newUserInput;

            if (serializableUserInput) {
                current.needsToSerializeInput = true;
                current.serializableUserInput = serializableUserInput;
            }
        }

        /**
         * @name getExistingUserInput
         * @desc Returns the existing user input.
         * @returns {Object} Existing user input.
         */
        function getExistingUserInput() {
            return current.userInput;
        }

        /**
         * Applies a given effect to the survey path, changing which
         * phases to go next
         * @param {Array} effectOnPath Array of numbers, each
         *                             telling which phase to go
         *                             next.
         */
        function changeSurveyPath(effectOnPath) {
            if (effectOnPath &&
                typeof(effectOnPath) === 'object' &&
                effectOnPath.length > 0) {
                nextPhases = effectOnPath;
            }
        }

        /**
         * Returns the proper name for the specified navigation
         * action, which changes if the current phase is a subphase.
         * @param   {String} action Name for the action, between
         *                        "Back" and "Advance"
         * @returns {String} The action's proper name.
         */
        function getActionName(action) {
            if (action === 'Back') {
                return current.isSubPhase ? 'Cancel' : 'Back';
            } else if (action === 'Advance') {
                return current.isSubPhase ? 'Done' : 'Next';
            }
        }

        /**
         * Tells if it is possible to advance to the next point of
         * progress in the survey.
         * @returns {Boolean} True if the user can advance.
         */
        function canAdvance() {
            var possibleToAdvance =
                current.isSubPhase ? true : nextPhases.length > 0;

            return getCurrentPhaseValidity() &&
                possibleToAdvance &&
                !loadingAPhase;
        }

        /**
         * Takes the user to the next step of progress in the survey.
         * This either can translate into going to the next
         * phase of the survey, or to the parent phase.
         *
         * @returns {Promise} Promise object for the next step's data
         */
        function advance() {
            if (!canAdvance()) {
                return $q.reject();
            }

            if (current.isSubPhase) {
                return goToParentPhase(AND_SAVE_INPUT).
                then(function(parentPhaseData) {
                    return parentPhaseData;
                });
            } else {
                return goToNextPhase().
                then(function(nextPhaseData) {
                    return nextPhaseData;
                });
            }
        }

        /**
         * Tells if it is possible to go back to a previous point of
         * progress in the survey.
         * @returns {Boolean} True if the user can go back.
         */
        function canGoBack() {
            return previousPhases.length > 0 &&
                !loadingAPhase;
        }

        /**
         * Takes the user to the previous step of progress in the
         * survey.
         * This either can translate into going to the previous
         * phase of the survey, or to the parent phase.
         *
         * @returns {Promise} Promise object for the previous step's
         *                    data
         */
        function goBack() {
            if (!canGoBack()) {
                return $q.reject();
            }

            if (current.isSubPhase) {
                return goToParentPhase(WITHOUT_SAVING).
                then(function(parentPhaseData) {
                    return parentPhaseData;
                });
            } else {
                return goToPreviousPhase().
                then(function(previousPhaseData) {
                    return previousPhaseData;
                });
            }
        }

        /**
         * Loads the specified sub-phase
         * @param   {number}  subPhaseNumber Number of the sub-phase
         *                                   the user will navigate
         *                                   to, as an offset to the
         *                                   parent phase
         * @returns {Promise} Promise object for the sub-phase data.
         */
        function goToSubPhase(subPhaseNumber) {
            //save input
            submitUserInput();

            current.isSubPhase = true;

            //keep track of parent phase
            previousPhases.unshift(current.phaseNumber); //add to head
            current.subPhaseNumber = subPhaseNumber;

            return loadPhase().
            then(function(subPhaseData) {
                return subPhaseData;
            });
        }

        /**
         * @name getCurrentPhaseData
         * @desc Gets the data from the current phase of the survey.
         * @returns {Object} Promise for current phase of the survey
         */
        function getCurrentPhaseData() {
            if (!current.phase || angular.equals(current.phase, {})) {
                return updateCurrentPhaseData().
                then(function(data) {
                    return data;
                });
            } else {
                return $q.when(current.phase);
            }
        }

        /**
         * @name getCurrentPhaseValidity
         * @desc Returns the validity of the current phase.
         * @returns {boolean} Current phase validity
         */
        function getCurrentPhaseValidity() {
            return current.phaseValidity;
        }

        /**
         * @name setCurrentPhaseValidity
         * @desc Changes the current phase's validity.
         * @param {boolean} validity Value to set the phase validity
         *                           to.
         */
        function setCurrentPhaseValidity(validity) {
            current.phaseValidity = validity;
        }

        //////////////// - helpers

        /**
         * Loads the current phase data and its ui-router state,
         * based on the current phase's number and type, and assuming
         * both parameters are up to date.
         */
        function loadPhase() {
            loadingAPhase = true;

            return updateCurrentPhaseData().
            then(function(phaseData) {
                //get previously saved input, if any
                if (current.isSubPhase) {
                    current.userInput = userInputService.getUserInput(
                        current.phaseNumber,
                        current.subPhaseNumber
                    );
                    current.needsToSerializeInput = false;
                } else {
                    current.userInput = userInputService.getUserInput(
                        current.phaseNumber
                    );
                    current.needsToSerializeInput = false;
                }

                //load phase state
                $state.go(phaseData.type, {
                    phaseId : current.phaseNumber,
                    subPhaseId : current.subPhaseNumber
                });

                loadingAPhase = false;
                return phaseData;
            }).
            catch(function() {
                loadingAPhase = false;
            });
        }

        /**
         * Imports the data of the current phase, updating the due
         * object.
         * @returns {Object} A promise object for the phase's data
         */
        function updateCurrentPhaseData() {
            if (current.isSubPhase) {
                return surveyDataService
                    .getSubPhaseData(current.phaseNumber,
                                     current.subPhaseNumber)
                    .then(success);
            } else {
                return surveyDataService
                    .getPhaseData(current.phaseNumber)
                    .then(success);
            }
            //TODO: if fails to fetch data, load some 'error' route

            function success(data) {
                current.phase = data;
                return current.phase;
            }
        }

        /**
         * Loads the next phase in the queue.
         * @returns {Promise} Promise object for the next phase's data
         */
        function goToNextPhase() {
            if (nextPhases.length === 0) {
                //can't advance if there are no next phases
                return $q.reject('no next phases');
            }
            submitUserInput();

            previousPhases.unshift(current.phaseNumber); //add to head
            current.phaseNumber = nextPhases.shift(); //remove from head

            return loadPhase().
            then(function(nextPhaseData) {
                return nextPhaseData;
            });
        }

        /**
         * Loads the previous phase of the survey.
         * @returns {Promise} Promise object for the previous phase's data
         */
        function goToPreviousPhase() {
            if (previousPhases.length === 0) {
                logger.info('There are no previous steps in this ' +
                            'survey.',
                            'userProgressService - No previousPhases');
                return; //can't go back if there are no previous phases
            }

            submitUserInput();

            nextPhases.unshift(current.phaseNumber); //add to head
            current.phaseNumber = previousPhases.shift(); //remove from head

            return loadPhase().
            then(function(previousPhaseData) {
                return previousPhaseData;
            });
        }

        /**
         * Loads the current sub-phase's parent phase, saving the
         * user input if wanted.
         * @param   {Boolean} saveFlag  Tells wether to submit, or
         *                              not, the input on this
         *                              sub-phase.
         * @returns {Promise} Promise object for the parent phase's data
         */
        function goToParentPhase(saveFlag) {
            if (saveFlag === AND_SAVE_INPUT) {
                submitUserInput();
            }

            current.phaseNumber = previousPhases.shift();
            current.isSubPhase = false;
            current.subPhaseNumber = undefined;

            return loadPhase().
            then(function(parentPhaseData) {
                return parentPhaseData;
            });
        }

        function submitUserInput() {
            var inputToSubmit =
                current.needsToSerializeInput ?
                current.serializableUserInput : current.userInput;

            if (current.isSubPhase) {
                userInputService.submitUserInput(
                    inputToSubmit,
                    current.phaseNumber,
                    current.subPhaseNumber
                );
            } else {
                userInputService.submitUserInput(
                    inputToSubmit,
                    current.phaseNumber
                );
            }
        }
    }
})();
