// configuration du fond de carte
var map = L.map('map', { //'L.' sont les fonctions natives de leaflet
center: [48.11, -1.66], //centrage en scr 4326
zoom: 12 });

// Ajouter des fonds de carte
var baselayers = {

OrthoRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'raster:ortho2021', attribution:'Rennes métropole'}),
 

Stadia: L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'}),
  
OSM: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
  
ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16}),
  
Dark:L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20})
};

baselayers.ESRI.addTo(map);

// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Ajouter un picto
var rennes2icone = L.icon({
iconUrl: 'https://i.redd.it/a-few-pixel-art-coat-of-arms-i-created-for-family-and-v0-iwmw7wqvnija1.png?width=1200&format=png&auto=webp&s=c12aeb9ea53de18e7f3033525e05812c8c52c979',
iconSize: [50, 50] });

var chateau = L.icon({
iconUrl: 'https://i.redd.it/a-few-pixel-art-coat-of-arms-i-created-for-family-and-v0-h52cql5unija1.png?width=1200&format=png&auto=webp&s=27ee6db51ee301100db3674f3088e4236e09cac9',
iconSize: [50, 50] });

//contenu popup 
var popuprennes2 = `<h1>Master SIGAT </h1> <br> <img src="https://media.licdn.com/dms/image/v2/D5603AQGagSTH4-Ulww/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1678805771095?e=2147483647&v=beta&t=4JVCnolKrYGwRxwTLaeZH_2rhjCI0wV2AzR9_pvjLWo" width="200px"> <br> <a href="https://esigat.wordpress.com/" target =_blank> Site du Master SIGAT</a><br><iframe src='https://flo.uri.sh/visualisation/24956365/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:200px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>`;

//dimension du popoup
var customOptions = {'maxWidth': '250', 'className' : 'custom'}

// Ajouter des marqueurs manuels
var rennes2 = L.marker([48.1184, -1.7025],{icon: rennes2icone}).bindPopup(popuprennes2,customOptions);

var maison = L.marker([48.09136035544983, -1.6738057188448219],{icon:chateau});

//ajouter des flux WMS en tant que couche
var route = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers:'trp_rout:v_rva_trafic_fcd',format: 'image/png', transparent: true}).addTo(map);

var batiment = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers:'ref_cad:batiment',format: 'image/png', transparent: true});

var haies = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers:'pnat_bocag:audiar_haies_bocageres',format: 'image/png', transparent: true});

var jeu = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers:'espub_mob:aire_jeu',format: 'image/png', transparent: true});

// Appel d'un geojson en ligne
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
  fillColor: '#76153C',
  radius: 4,
  fillOpacity: 0.7,
  stroke: false};
},
}
).addTo(map);
// Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});
});

//Déclarer les couches à afficher
var couche = {
  "Traffic en temps réel" : route,
  "bâtiments" : batiment,
  "Haies bocagères" : haies,
  "Aires de jeu" : jeu,
  "Rennes 2" : rennes2,
  "Maison" : maison
};

// Menu de controle des fonds de carte
L.control.layers(baselayers, couche, {
  position: 'topleft', 
  collapsed : true 
}).addTo(map);