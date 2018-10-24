// NOTE: This file will be edited automatically by a puppet script in the deployment process, DO NOT EDIT BY HAND

var WEBSERVICE_URL = 'http://tw-160.xtr.deltares.nl/liwo.ws/';                                    //url for webservice calls [ending with a forward slash]
var STATIC_GEOSERVER_URL = 'http://tl-396.xtr.deltares.nl:8080/geoserver/';             //url for static geoserver [ending with a forward slash]
var DYNAMIC_GEOSERVER_URL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/';    //url for dynamic geoserver [ending with a forward slash]
var STATIC_GEOSERVER_LOCAL = 'http://tl-396.xtr.deltares.nl:8080/geoserver/';     //url for internal routing to static geoserver [ending with a forward slash]
var DYNAMIC_GEOSERVER_LOCAL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/';         //url for internal routing to dynamic geoserver [ending with a forward slash]
var PRINT_GEOSERVER_URL = 'http://tl-396.xtr.deltares.nl:8080/print/';                  //url for print geoserver [ending with a forward slash]
var ACHTERGRONDKAART = 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png';
var LUCHTFOTOKAART = 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/{z}/{x}/{y}.png';
var PDOKLUCHTFOTO = 'http://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms';
var PDOKBRTACHTERGROND = 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts';
var MANUAL_URL = 'https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/';
