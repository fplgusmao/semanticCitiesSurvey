/* global toastr:false, moment:false, L:false, L.FreeDraw:false */
(function() {
    'use strict';

    angular
        .module('scsApp.core')
        .constant('hostPath', '')
        //^^^ the prefix path for accessing the app files
        //^^^ e.g: 'dir/in/host'
        //^^^ !!!MUST!!! end with '/'
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('leaflet', L)
        .constant('LeafletFreeDraw', L.FreeDraw);
})();
