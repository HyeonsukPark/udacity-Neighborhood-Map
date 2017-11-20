//initMap Function  
var initMap = function() {

    // A list of places 
    var initList = [

        {
            title: 'Se de Lisboa',
            location: {
                lat: 38.7098192,
                lng: -9.1337575
            },
            id: '1',
            cityStr: 'Lisbon Cathedral',
            address: 'Largo da Sé, 1100-585 Lisboa',
            cafe: 'https://www.zomato.com/grande-lisboa/pois-caf%C3%A9-1-s%C3%A9-lisboa',
            information: 'The Lisbon Cathedral (Portuguese: <b>Sé de Lisboa</b>) often called simply the Sé, is a Roman Catholic church located in Lisbon, Portugal. The oldest church in the city is the see of the Archdiocese of Lisbon. Since the beginning of the construction of the cathedral, in the year 1147, the building has been modified several times and survived many earthquakes. It is nowadays a mix of different architectural styles. It has been classified as a National Monument since 1910.'

        },

        {
            title: 'Parque das Nações',
            location: {
                lat: 38.766281,
                lng: -9.0959056
            },
            id: '2',
            cityStr: 'Parque das Nações',
            cafe: 'https://www.zomato.com/grande-lisboa/saboreia-ch%C3%A1-e-caf%C3%A9-parque-das-na%C3%A7%C3%B5es-lisboa',
            address: '221 Alameda dos Oceanos 1990 Lisboa',
            information: 'Taking advantage of its geographical position, <b>Parque das Nações</b> also has a brand new marina, Marina Parque das Nações featuring 600 berths and modern infrastructures, a river pier for cruises or historical vessels and an exclusive pontoon prepared to receive nautical and on land events, and a spot for bird watching as it is sited in the Tagus Estuary, one of the largest and diverse estuaries of Europe.'

        },

        {
            title: 'Pasteis de Belem',
            location: {
                lat: 38.6974332,
                lng: -9.2031955
            },
            id: '3',
            cafe: 'https://www.zomato.com/grande-lisboa/past%C3%A9is-de-bel%C3%A9m-bel%C3%A9m-lisboa',
            cityStr: 'Pastel de nata',
            address: 'R. Belém 84-92, 1300-085 Lisboa',
            information: '<b>Pastel de nata</b> is a Portuguese egg tart pastry, originally from Portugal which can also be found in countries with significant Portuguese immigrant populations.'

        },

        {
            title: 'Castelo de S.Jorge',
            location: {
                lat: 38.7138776,
                lng: -9.1333589
            },
            id: '4',
            cafe: 'https://www.zomato.com/grande-lisboa/caf%C3%A9-da-garagem-castelo-lisboa',
            cityStr: 'São Jorge Castle',
            address: 'R. de Santa Cruz do Castelo, 1100-129 Lisboa',
            information: 'São Jorge Castle (Portuguese: <b>Castelo de São Jorge</b>) is a Moorish castle occupying a commanding hilltop overlooking the historic centre of the Portuguese city of Lisbon and Tagus River. The strongly fortified citadel dates from medieval period of Portuguese history, and is one of the main tourist sites of Lisbon.'



        },

        {
            title: 'Oceanário De Lisboa',
            location: {
                lat: 38.7625430,
                lng: -9.0937450
            },
            id: '5',
            cafe: 'https://www.zomato.com/apadariaportuguesaexpo',
            cityStr: 'Lisbon Oceanarium',
            address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa',
            information: 'The Lisbon Oceanarium (Portuguese: <b>Oceanário de Lisboa</b>) is an oceanarium in Lisbon, Portugal. It is located in the Parque das Nações, which was the exhibition grounds for the Expo 98. It is the largest indoor aquarium in Europe.'


        },

        {
            title: 'Torre de Belem',
            location: {
                lat: 38.6938380,
                lng: -9.2127880
            },
            id: '6',
            cafe: 'https://www.zomato.com/grande-lisboa/sud-lisboa-bel%C3%A9m-lisboa',
            cityStr: 'Belem Tower',
            address: ' Av. Brasília, 1400-038 Lisboa',
            information: 'Belém Tower (or the Tower of St Vincent) is a fortified tower located in the civil parish of Santa Maria de Belém in the municipality of Lisbon, Portugal.'
        }
    ];



    // It's a ViewModel of knockout.js 
    var ViewModel = function() {

        var self = this;

        // GoogleMap Api loading 
        self.googleMap = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 38.7436057,
                lng: -9.2302432
            },
            zoom: 13,
            mapTypeControl: false,
            draggable: true
        });


        self.lists = [];

        initList.forEach(function(place) {
            self.lists.push(new Place(place));
        });


        self.lists.forEach(function(place) {


            // Options to add things in marker
            var markerOptions = {
                title: place.title,
                position: place.position,
                map: self.googleMap,
                animation: google.maps.Animation.DROP,
                draggable: false,
                cityStr: place.cityStr,
                content: ''
            };


            // Make markers
            place.marker = new google.maps.Marker(markerOptions);

            // adding infowindows
            place.marker.infoWindow = new google.maps.InfoWindow({
                position: place.position,
                //content: contentString
            });


            //setting marker icons 
            var defaultIcon = makeMarkerIcon();
            var highlightedIcon = highlightIcon();

            // Marker animations - togglebounce
            place.marker.addListener('click', function() {
                place.marker.infoWindow.open(self.googleMap);
                place.openInfoWindow(place);

            });

            place.marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });

            place.marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });


            self.toggleBounce = function(place) {
                if (place.marker.getAnimation() !== null) {
                    place.marker.setAnimation(null);
                } else {
                    place.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        place.marker.setAnimation(null);
                    }, 1400);
                }
            };


            self.lisbonList = ko.observableArray();

            self.lists.forEach(function(place) {
                self.lisbonList.push(place);
            });

            self.writeText = ko.observable('');
        });


        var wikiApi = function(place) {
            // Wiki Api
            // cityStr is english name of the locations.
            var cityStr = place.cityStr;

            var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                cityStr + '&format=json&callback=wikiCallback';


            // Ajax to call the wikipedia Api 
            $.ajax({
                url: wikiUrl,
                dataType: "jsonp",
                jsonp: "callback",
                success: function(response) {
                    console.log(response);
                    var articleList = response[0];
                    var articleStr;
                    var url;
                    articleStr = articleList;
                    url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    var contentString = '<div class="info-window">' + '<h1 class="info-title">' + place.title + '</h1>' +
                        '<h2 class="info-paragraph">' + place.information + '</h2>' +
                        '<p class="cafe-info">Cafe in <a href="' + place.cafe + '">' + place.title + '</a>' + '</p>' + 
                        '<div id="contentWiki"' + place.id + '>' + '<ul id="wiki-ul">' +
                        '<li id="wiki-li">Wiki about <a id="wiki-list" href="' + url + '">' + articleStr + '</a></li>' + '</ul>' +
                        '</div>' + '</div>';

                    place.marker.infoWindow.setContent(contentString);

                },
                error: function(response) {
                    //alert message when Ajax can't load wikipedia Api.
                       alert("failed to call Api");
                }
            });
        };

        
        // defined place
        function Place(data) {
            this.title = data.title;
            this.position = data.location;
            this.address = data.address;
            this.information = data.information;
            this.cityStr = data.cityStr;
            this.id = data.id;
            this.cafe = data.cafe;

            // openinfowindow 
            this.openInfoWindow = function(place) {
                wikiApi(this);
                this.marker.infoWindow.open(self.googleMap, this.marker);
                self.toggleBounce(place);
            };
                this.marker = null;
        }

       
        //filter search
        // If the inputplace is one of the places on the list , then the place is visible.
        self.filterEvent = function() {
            // search event 
            var searchInput = self.writeText().toLowerCase();

            self.lisbonList.removeAll();

            self.lists.forEach(function(place) {
                place.marker.setMap(null);
                if (place.title.toLowerCase().indexOf(searchInput) !== -1) {
                    self.lisbonList.push(place);
                }
            });

            self.lisbonList().forEach(function(place) {
                place.marker.setMap(self.googleMap);
            });
        };

    };

    ko.applyBindings(new ViewModel());
};


    var mapError = function() {
            alert("Failed to load Google Map");
        };

    // markers 
    function makeMarkerIcon() {
    // red marker - default marker - it's red marker when the mouse is out 
    var markerImage = new google.maps.MarkerImage(
        'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

    function highlightIcon() {
    // yellow marker -  it's yellow marker when the mouse is over the marker. 
    var markerImage = new google.maps.MarkerImage(
        'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


// DOM event for the sidebar menu. 
   var openNav;
   var closeNav;

   function openNav() {
     document.getElementById("mySidenav").style.width = "250px";
}

   function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}