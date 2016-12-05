(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .factory('mapService', mapService);

    mapService.$inject = ['leaflet', 'logger', '$q'];

    /* @ngInject */
    function mapService(leaflet, logger, $q) {
        var map;
        var mapInputLayer, lastInputId;

        var deferredElement = $q.defer();
        var promisedHtmlElement = deferredElement.promise;

        var exports = {
            setMapTemplateElement       : setMapTemplateElement,
            getMap                      : getMap,
            loadMap                     : loadMap,
            addMapInteraction           : addMapInteraction,
            removeMapInteraction        : removeMapInteraction,
            removeAllMapInteractions    : function() {
                removeMapInteraction();
            },
            addToMap                    : addToMap,
            removeFromMap               : removeFromMap,
            removeAllFromMap            : function() {
                removeFromMap(); //clears all input
            },
            undoLastAddition            : function() {
                removeFromMap(lastInputId);
            },
            getSerializableUserInput    : getSerializableUserInput,
            hasUserInput                : hasUserInput
        };

        return exports;

        ////////////////

        /**
         * Sets the HTML where the map should be placed/linked to.
         * @param   {HTMLElement} mapElement HTML element where the
         *                                   leaflet map should be
         *                                   instantiated.
         */
        function setMapTemplateElement(mapElement) {
            deferredElement.resolve(mapElement);
        }

        /**
         * Returns a promise to the HTML element to which the leaflet
         * map should be associated/linked.
         * @returns {Promise} Promise to the HTML element.
         */
        function getMapTemplateElement() {
            return promisedHtmlElement;
        }

        /**
         * Returns the map object.
         * @returns {Object} Map object, or 'undefined' if map is not
         *                   initialized.
         */
        function getMap() {
            return map;
        }

        /**
         * Reloads the view over the map, and respective tile layer,
         * to the given one.
         * @param   {Object}  mapAttributes Attributes of the new
         *                                  view over the map.
         * @returns {Promise} Promise to the map.
         */
        function loadMap(mapAttributes) {
            return getMapTemplateElement().
            then(createMap);

            function createMap(templateElement) {
                if (typeof(map) !== 'undefined') {
                    //IF map was previously created
                    resetMapAndPromises();
                } else {
                    //IF it's the first time creating the map,
                    //reset template-related promises, as a clean-up
                    //for next time this function's called
                    deferredElement = $q.defer();
                    promisedHtmlElement = deferredElement.promise;
                }

                map = leaflet.map(templateElement, {
                    scrollWheelZoom : true,
                    doubleClickZoom : false,
                    boxZoom : false,
                    zoomControl : false, //disables zoom buttons
                    attributionControl : false //disables attribution reference on the map
                });

                //position zoom buttons on the bottom right corner
                //a la google maps
                leaflet.control.zoom({
                    position : 'bottomright'
                }).addTo(map);

                if (typeof(map) === 'undefined') {
                    //in case leaflet.map fails
                    logger.error('Failed to load map',
                                 'Leaflet map initialization failed');
                    return;
                }

                setupView(mapAttributes.view.center,
                          mapAttributes.view.zoomLevel,
                          mapAttributes.view.bounds);

                setupTileLayer(mapAttributes.tiles.tilesUrl,
                               mapAttributes.tiles.tilesAttributes);

                setupInputLayer();

                return map;
            }
        }

        /**
         * Registers a listener for a certain Leaflet map event, and
         * the callback for when that event is triggered (e.g:
         * 'click' event).
         * @param {string}   type     Type of the event, according to
         *                            Leaflet's map supported events.
         * @param {function} callback Function to be called when the
         *                            event is triggered.
         */
        function addMapInteraction(type, callback) {
            map.on(type, callback);
        }

        /**
         * Removes a certain, or all callbacks associated with the
         * specified event. If no callback function is provided as an
         * argument, all callbacks are removed. If no callback nor
         * event type are provided, then it removes every callback of
         * every type of event.
         * @param {string}   type     Type of the event, according
         *                            to Leaflet's map supported
         *                            events.
         * @param {function} callback Specific function to be
         *                            disassociated as a callback to
         *                            the event
         */
        function removeMapInteraction(type, callback) {
            map.off(type, callback);
        }

        /**
         * Adds the given layer (like a marker or a drawn polygon)
         * to the user input layer group. If provided, associates a
         * callback to a click event on the added drawable.
         * @param   {object}   thing            Object to be added as
         *                                      a leaflet layer to the
         *                                      input layer group.
         * @param   {Function} clickInteraction Effect of a click
         *                                      event on the added
         *                                      layer.
         * @returns {Number}   The ID, relative to the input layer
         *                     group, of the inserted layer.
         */
        function addToMap(thing, clickInteraction) {
            mapInputLayer.addLayer(thing);
            lastInputId = mapInputLayer.getLayerId(thing);

            if (typeof(clickInteraction) !== 'undefined') {
                //if an interaction was provided
                mapInputLayer
                    .getLayer(lastInputId)
                    .on('click', clickInteraction);
            }

            return lastInputId;
        }

        /**
         * Removes a given layer, or all of them, from the user input
         * layer group. If provided no argument, it removes every
         * layer of the input layer group.
         * @param   {string | object} layer Object of the layer to
         *                                  be removed, or its ID
         * @returns {object}          Resulting layer group object.
         */
        function removeFromMap(layer) {
            if (layer) { //if a layer object or layerID is provided
                mapInputLayer.removeLayer(layer);
            } else {
                mapInputLayer.clearLayers(); //delete all the group's layers
            }

            return mapInputLayer;
        }

        /**
         * Returns a serializable version, as GeoJSON, of the input layer group
         * @returns {string} GeoJSON for the input layer group
         */
        function getSerializableUserInput() {
            if (typeof(mapInputLayer) === 'undefined' ||
                !map.hasLayer(mapInputLayer)) {
                return '';
            } else {
                return mapInputLayer.toGeoJSON();
            }
        }

        function hasUserInput() {
            return (typeof(mapInputLayer) !== 'undefined') &&
                (mapInputLayer.getLayers().length > 0);
        }

        //////////////// – Helpers

        function setupView(center, zoomLevel, bounds) {
            map.setView(center, zoomLevel);

            map.setMaxBounds(leaflet.latLngBounds(
                bounds.southWest,
                bounds.northEast
            ));

            return map;
        }

        function setupTileLayer(tilesUrl, attributes) {
            var tiles = leaflet.tileLayer(tilesUrl, attributes);
            map.addLayer(tiles);

            return map;
        }

        /**
         * Adds a layer group to support user input. Every action
         * made, or layers added by the user should be kept in this
         * layer.
         * @returns {Object} Resulting state of the map after setting
         *                   up the input layer.
         */
        function setupInputLayer() {
            mapInputLayer = leaflet.layerGroup();
            map.addLayer(mapInputLayer);

            return map;
        }

        /**
         * Modifies the service's state to one close to the initial
         * one. It should behave as if no map was yet created, and no
         * map-based-phase loaded.
         */
        function resetMapAndPromises() {
            map.clearAllEventListeners();
            map.remove();

            mapInputLayer.clearLayers();
            mapInputLayer = undefined;

            deferredElement = $q.defer();
            promisedHtmlElement = deferredElement.promise;
        }
    }
})();
