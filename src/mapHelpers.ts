import mapboxgl from "mapbox-gl";
import geoViewport from "@mapbox/geo-viewport";

function getGeoJsonSource(gpsCoordinates: [number, number][]): GeoJSON.Feature {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: gpsCoordinates,
    },
  };
}

function addRouteLayers(
  mapInstance: mapboxgl.Map,
  gpsCoordinates: [number, number][]
) {
  try {
    console.log("adding layers", gpsCoordinates.length);
    // add route source
    mapInstance.addSource("primary", {
      type: "geojson",
      data: getGeoJsonSource(gpsCoordinates),
    });

    // we will add the route layer here since it seems to disappear
    mapInstance.addLayer({
      id: "primary_outline",
      type: "line",
      source: "primary",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#000000",
        "line-width": 10,
      },
    });

    mapInstance.addLayer({
      id: "primary",
      type: "line",
      source: "primary",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#33B4FF",
        "line-width": 7,
      },
    });

    mapInstance.addLayer({
      id: "chevron_line",
      type: "symbol",
      source: "primary",
      layout: {
        "icon-image": "chevron",
        "icon-size": 0.5,
        "symbol-placement": "line",
        "symbol-spacing": 25,
        "symbol-z-elevate": false,
      },
    });

    if (!mapInstance.getSource("contours")) {
      mapInstance.addSource("contours", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });
    }

    if (!mapInstance.getLayer("contours")) {
      mapInstance.addLayer({
        id: "contours",
        type: "line",
        source: "contours",
        "source-layer": "contour",
        layout: {
          visibility: "visible",
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#877b59",
          "line-width": 1,
        },
      });
    }
  } catch (error) {
    console.error("Error adding route layers", error);
  }
}

function removeRouteLayers(mapInstance: mapboxgl.Map) {
  if (mapInstance.getLayer("primary")) {
    mapInstance.removeLayer("primary");
  }

  if (mapInstance.getLayer("primary_outline")) {
    mapInstance.removeLayer("primary_outline");
  }

  if (mapInstance.getLayer("chevron_line")) {
    mapInstance.removeLayer("chevron_line");
  }

  if (mapInstance.getSource("primary")) {
    mapInstance.removeSource("primary");
  }
}

function addStartAndFinishMarkers(
  mapInstance: mapboxgl.Map,
  gpsCoordinates: [number, number][]
) {
  const selectedStartMarker = document.createElement("div");
  selectedStartMarker.className = "map_start_location";
  new mapboxgl.Marker({ element: selectedStartMarker })
    .setLngLat(gpsCoordinates[0])
    .addTo(mapInstance);

  const selectedFinishMarker = document.createElement("div");
  selectedFinishMarker.className = "map_finish_location";
  new mapboxgl.Marker({ element: selectedFinishMarker })
    .setLngLat(gpsCoordinates[gpsCoordinates.length - 1])
    .addTo(mapInstance);
}

const removeStartAndFinishMarkers = () => {
  const startMarker = document.querySelectorAll(".map_start_location");
  startMarker.forEach((marker) => marker.remove());
  const finishMarker = document.querySelectorAll(".map_finish_location");
  finishMarker.forEach((marker) => marker.remove());
};

function newMarker(color: string | undefined, rotation: number) {
  return new mapboxgl.Marker({
    color,
    rotation,
  });
}

function getBoundingBox(
  coordinates: [number, number][],
  bottomOffset?: number
): geoViewport.BoundingBox {
  let latMin: number | undefined;
  let latMax: number | undefined;
  let longMin: number | undefined;
  let longMax: number | undefined;

  coordinates.forEach((coord) => {
    const [long, lat] = coord;
    latMin = !latMin || lat < latMin ? lat : latMin;
    latMax = !latMax || lat > latMax ? lat : latMax;

    longMin = !longMin || long < longMin ? long : longMin;
    longMax = !longMax || long > longMax ? long : longMax;
  });
  return [
    longMin || 0,
    (latMin || 0) * (bottomOffset || 1),
    longMax || 0,
    latMax || 0,
  ];
}

function setIsLayerVisible(
  mapInstance: mapboxgl.Map,
  layerId: string,
  visible: boolean
) {
  if (mapInstance.getLayer(layerId)) {
    mapInstance.setLayoutProperty(
      layerId,
      "visibility",
      visible ? "visible" : "none"
    );
  }
}

export {
  newMarker,
  getBoundingBox,
  getGeoJsonSource,
  addRouteLayers,
  setIsLayerVisible,
  addStartAndFinishMarkers,
  removeStartAndFinishMarkers,
  removeRouteLayers,
};
