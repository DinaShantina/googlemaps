window.onload = () => {
  setTimeout(function () {
    document.querySelector(".title").style.opacity = "1";
    document.querySelector(".title").style.transition = ".25s ease-in";
  }, 200);
  setTimeout(function () {
    document.querySelector(".search-container").style.opacity = "1";
    document.querySelector(".search-container").style.transition =
      ".25s ease-in";
  }, 300);
  setTimeout(function () {
    document.querySelector(".stores-list-container").style.opacity = "1";
    document.querySelector(".stores-list-container").style.transition =
      ".25s ease-in";
  }, 400);
};
var map;
var markers = [];
var infoWindow;
var icon;
var image = "images/marker1.png";

function initMap() {
  var losangeles = { lat: 34.077048, lng: -118.249999 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losangeles,
    zoom: 11,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    for (var store of stores) {
      var postal = store["address"]["postalCode"].substring(0, 5);
      if (postal == zipCode) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarker(foundStores);
  setOnClickListener();
}
function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      new google.maps.event.trigger(markers[index], "click");
    });
  });
}
function displayStores(stores) {
  var storeHtml = "";
  var count = 0;
  for (var store of stores) {
    count++;
    var address = store["addressLines"];
    var phoneNumber = store["phoneNumber"];
    storeHtml += `
    <div id=${count - 1} class="store-container">
    <div class="store-address">
      <div>
        <p>${address[0]}</p>
        <p>${address[1]}</p>
      </div>
      <div class="number">
        <p>${count}</p>
      </div>
    </div>
    <div class="store-phone-number">${phoneNumber}</div>
  </div>
    `;
    document.querySelector(".stores-list").innerHTML = storeHtml;
  }
}

function showStoresMarker(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );

    var name = store["name"];
    var address = store["addressLines"][0];
    var open = store["openStatusText"];
    var tel = store["phoneNumber"];
    var origin = "";
    bounds.extend(latlng);
    createMarker(latlng, name, address, open, tel, origin, index + 1);
  }
  map.fitBounds(bounds);
}
function createMarker(latlng, name, address, open, tel, origin, index) {
  var html = `
  <div class="marker-text">
  <p class="title-map">${name}</p><p class="open-untill">${open}</p>
  
  <p class="link-google"><i class='fas fa-location-arrow'></i><a href="https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${latlng}" target="_blank">${address}</a></p>
  <p class="link-google"><i class="fas fa-phone-alt "></i><a href="tel: ${tel}"> ${tel}</a></p>
  </div>
 
  `;

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
    // animation: google.maps.Animation.DROP,
    icon: image,
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
