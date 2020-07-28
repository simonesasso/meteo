$("#search-icon").click(function () {

  // svuotare container per non accumulare risultati--------------
  $(".weather-list").html("");

  generaChiamata("http://api.openweathermap.org/data/2.5/forecast","42ec52e849b1b9a2e3fd0235340dfad8");

 }
)
function generaChiamata(url,key) {
  var input = $("#search-bar").val();

  var realinput = input.split(",")[0];

  if (input != "") {

    $.ajax({
     url: url,
     method: "GET",
     datatype: "jasonp",
     data: {
       q: realinput,
       appid: key,
       units: "metric"

     },
     success: function (data,stato) {

console.log(data);


      console.log(data.list);
      var arrayPrev = data.list;
      var date = arrayPrev[0].dt_txt;
      var day = parseInt(date.substring(8, 11));
      console.log(day);
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];
      var arr4 = [];
      var arr5 = [];
      var test = 1;
      for (var i = 0; i < arrayPrev.length; i++) {
        var datei = arrayPrev[i].dt_txt;

        var dayi = parseInt(datei.substring(8, 11));

        if (dayi != day) {
          test = test + 1;
          day = dayi;
        }
        console.log("test: " + test);
        if (test == 1) {
          arr1.push(arrayPrev[i]);
        }
        if (test == 2) {
          arr2.push(arrayPrev[i]);
        }
        if (test == 3) {
          arr3.push(arrayPrev[i]);
        }
        if (test == 4) {
          arr4.push(arrayPrev[i]);
        }
        if (test == 5) {
          arr5.push(arrayPrev[i]);
        }
      }

      printdays();
      printweather(arr1,0);
      printweather(arr2,1);
      printweather(arr3,2);
      printweather(arr4,3);
      printweather(arr5,4);
      $(".cover").fadeOut(1000);
    },
    error: function (richiesta,stato,errore) {
     alert("Si è verificato un errore", errore);
    }
   })

}}

// stampa giorni della settiana-------------------
function printdays() {
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var d = new Date();
  var currentDay = d.getDay();



  $(".day-button").each(function(){
   $(this).find(".dayName").text(weekday[currentDay])
   if (currentDay == 6) {
     currentDay = 0;
   }else {
     currentDay += 1;
   }

   
 });
}

// stampa previsioni e data dei giorni-------------------------------------
function printweather(arr, test) {
  var testul = test + 1;
  var targethandlebar = "#list" + testul;

  var dateofday = arr[0].dt_txt;
  var dateofdayfixed = dateofday.substring(0, 10);
  var button = $(".day-button").eq(test);
  button.find(".date").text(dateofdayfixed)

  var source = document.getElementById("template-lista").innerHTML;
  var template = Handlebars.compile(source);

  for (var i = 0; i < arr.length; i++) {

    var ora = arr[i].dt_txt;
    var orafixed = ora.substring(11, 16);

    var ctemp = arr[i].main.temp;
    var valNum = parseFloat(ctemp);

    // conversione da celsius a farenheit-----------------
    var ftemp = (valNum*1.8)+32;
    var ftempstring = String(ftemp);
    var ftempfix = ftempstring.substring(0, 5);

    var iconcode = arr[i].weather[0].icon;
    var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";

    var description = arr[i].weather[0].description;
    if (description == "heavy intensity rain") {
      description = "heavy rain";
    }

    var humidity = arr[i].main.humidity;
    var pressure = arr[i].main.pressure;
    var speed = arr[i].wind.speed;


    // handlebars---------------
      var context = {
           ora: orafixed,
           icon: iconurl,
           description: description,
           Ctemperatura: ctemp,
           Ftemperatura: ftempfix,
           humidity: humidity,
           pressure: pressure,
           speed: speed
         };
         var html = template(context);
         $(targethandlebar).append(html);
       }
     }






// CAMBIO UNITA MISURA GRADI----------------------------
$( ".weather-list" ).on( "click", ".celsius", function( ) {

   $(".f-degrees").hide();
   $(".farenheit").addClass("inactive-degree");
   $(".c-degrees").show();
   $(".celsius").removeClass("inactive-degree");

});
$( ".weather-list" ).on( "click", ".farenheit", function( ) {

   $(".f-degrees").show();
   $(".farenheit").removeClass("inactive-degree");
   $(".c-degrees").hide();
   $(".celsius").addClass("inactive-degree");

});
// MOSTRARE ULTERIORI INFO NELLA SINGOLA RIGA-----------
$( ".weather-list" ).on( "click", ".more", function( ) {
  $(this).parent().hide();
  $(this).parent().siblings().css("visibility", "visible");
});
$( ".weather-list" ).on( "click", ".back", function( ) {
  $(this).parent().css("visibility", "hidden");
  $(this).parent().siblings().show();
});




// NAVIGAZIONE GIORNI PREVISIONI------------------------
$(".day-button").click(
  navDays
);
function navDays() {
  // in alternativa
  // var palIndex = $(this).index();
  var dayIndex = $(".day-button").index(this);
  $( ".day" ).eq(dayIndex).siblings().removeClass("active");
  $( ".day" ).eq(dayIndex).addClass("active");
  $(this).siblings().removeClass("active-day-button");
  $(this).addClass("active-day-button");

}

// algolia autocomplete e map----------------------------------


if ($("#search-bar").length) {
  var placesAutocomplete = places({
    appId: "your appID",
    apiKey: "your apiKey",
    container: document.querySelector('#search-bar')
  });

  var map = L.map('map-example-container', {
   scrollWheelZoom: true,
   zoomControl: true
 });

 var osmLayer = new L.TileLayer(
   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     minZoom: 1,
     maxZoom: 5,
     attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
   }
 );

 var markers = [];

 map.setView(new L.LatLng(0, 0), 1);
 map.addLayer(osmLayer);

 placesAutocomplete.on('suggestions', handleOnSuggestions);
 placesAutocomplete.on('cursorchanged', handleOnCursorchanged);
 placesAutocomplete.on('change', handleOnChange);
 placesAutocomplete.on('clear', handleOnClear);

 function handleOnSuggestions(e) {
   markers.forEach(removeMarker);
   markers = [];

   if (e.suggestions.length === 0) {
     map.setView(new L.LatLng(0, 0), 1);
     return;
   }

   e.suggestions.forEach(addMarker);
   findBestZoom();
 }

 function handleOnChange(e) {
   markers
     .forEach(function(marker, markerIndex) {
       if (markerIndex === e.suggestionIndex) {
         markers = [marker];
         marker.setOpacity(1);
         findBestZoom();
       } else {
         removeMarker(marker);
       }
     });
 }

 function handleOnClear() {
   map.setView(new L.LatLng(0, 0), 1);
   markers.forEach(removeMarker);
 }

 function handleOnCursorchanged(e) {
   markers
     .forEach(function(marker, markerIndex) {
       if (markerIndex === e.suggestionIndex) {
         marker.setOpacity(1);
         marker.setZIndexOffset(1000);
       } else {
         marker.setZIndexOffset(0);
         marker.setOpacity(0.5);
       }
     });
 }

 function addMarker(suggestion) {
   var marker = L.marker(suggestion.latlng, {opacity: .4});
   marker.addTo(map);
   markers.push(marker);
 }

 function removeMarker(marker) {
   map.removeLayer(marker);
 }

 function findBestZoom() {
   var featureGroup = L.featureGroup(markers);
   map.fitBounds(featureGroup.getBounds().pad(0.5), {animate: false});
 }

}
