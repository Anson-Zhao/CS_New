/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Standard WorldWind layers
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "http://cs.aworldbridgelabs.com:8080/geoserver/ows?service=WMS&request=GetCapabilities&version=1.1.1";
        // Named layer displaying Average Temperature data

        var layerName = ["City_Smart:KEAGridMap_Layer","City_Smart:OHC_3","City_Smart:Overhead_Transformers","City_Smart:OHC_1","City_Smart:OHC_2","City_Smart:UGC_1","City_Smart:UGC_2","City_Smart:UGC_3","City_Smart:Wire_Transmission_Kodiak","City_Smart:Kodiak_Large_Transformers","City_Smart:Kodiak_Small_Transformers","City_Smart:Airport_Substation","City_Smart:K_Subs","City_Smart:Kodiak_Substations","City_Smart:FUSE_line_Kodiak","City_Smart:power","City_Smart:power2","City_Smart:Line_WMS_Kodiak_Trident","City_Smart:Polygon_WMS_Kodiak_Trident","City_Smart:MANHOLE_line","City_Smart:MANHOLE_polygon","City_Smart:water2c_FTAA","City_Smart:water3_FTAA","City_Smart:water1c_FTAA","City_Smart:water2_FTAA","City_Smart:water3c_FTAA","City_Smart:water1_FTAA","City_Smart:BaseRoad_Layer","City_Smart:Kodiak_Road_System","City_Smart:KEAParcelMap_Layer"];
        var layerName2 = [];
        var layer = wwd.layers;

        var createLayer = function (xmlDom) {
            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            for (var n = 0; n < layerName.length; n++) {
                var NA = layerName[n];


                var wmsLayerCapabilities = wms.getNamedLayer(NA);
                // Form a configuration object from the WmsLayerCapability object
                var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
                // Modify the configuration objects title property to a more user friendly title
                wmsConfig.title = NA;
                // Create the WMS Layer from the configuration object
                var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
                // Add the layers to WorldWind and update the layer manager
                wwd.addLayer(wmsLayer);
                // layerManager.synchronizeLayerList();


            }

        };
        console.log(layers);

        var layer2 = [];
        $(".switch_right").each(function (i) {
            layer2[i] = $(this).val();
        });

        (layerName2).push(layer2);
        console.log("array"+ layerName);
        console.log("array2" + layerName2);




        $(function(){
            $('.switch_right').click(function(){
                var val = [];
                if ($('.switch_right').is(":checkbox:checked")) {

                    // console.log("true"+val);

                    $(':checkbox:checked').each(function (i) {
                        val[i] = $(this).val();
                        console.log(val);
                        // console.log("checked" + val[i]);
                        // console.log(val);
                        // console.log("s"+layers[a].displayName);

                        for (var a = 0; a < layers.length; a++) {
                            if (layers[a].displayName === val[i]) {

                                layers[a].enabled = true;
                                // console.log(layers[a]);
                            }else if (val[i] < 1){
                                console.log("error");
                            }

                        }

                    });
                }

                if($('.switch_right').is(":not(:checked)")) {
                    // console.log("enable:false");
                    var layer = [];
                    $(":checkbox:not(:checked)").each(function (i) {
                        layer[i] = $(this).val();
                        // console.log(layer[i]);


                        // console.log(val);
                        // console.log("s"+layers[a].displayName);

                        for (var a = 0; a < layers.length; a++) {
                            if (layers[a].displayName === layer[i]) {

                                layers[a].enabled = false;

                                // console.log(layers[a]);
                            }

                        }

                    });




                }
                // $.get(serviceAddress).done(createLayer).fail(logError);
            });
        });

        //




        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };




        $.get(serviceAddress).done(createLayer).fail(logError);
    });
