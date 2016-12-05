(function () {
    'use strict';

    var core = angular.module('scsApp.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 5000;
        toastr.options.positionClass = 'toast-bottom-center';
        toastr.options.closeButton = true;
    }

    var config = {
        appErrorPrefix: '[semanticCitiesSurvey Error] ',
        appTitle: 'Semantic Cities Survey'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
    }

})();
