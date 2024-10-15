import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { RouteRecord } from "./RouteRecord";
import {
  addRouteLayers,
  addStartAndFinishMarkers,
  getBoundingBox,
} from "./mapHelpers";
import "mapbox-gl/dist/mapbox-gl.css";
import "./assets/map-layers/map.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2Fob29maXRuZXNzIiwiYSI6ImNsNnFxdGc5YTBjczkzZXF5azNtbHVtdXAifQ._a76os3V97uNmzMPmay_0Q";

function MapComponent({
  routeJson,
  showSatellite,
}: {
  routeJson: RouteRecord[];
  showSatellite: boolean;
}) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [styleLoaded, setStyleLoaded] = useState(0);
  const [currentStyle, setCurrentStyle] = useState(0);
  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const gpsCoordinates: [number, number][] | undefined = useMemo(() => {
    // convert records to gps coordinates
    if (routeJson !== undefined) {
      return routeJson.map((record) => [record.lon_deg, record.lat_deg]);
    }
    return undefined;
  }, [routeJson]);

  useEffect(() => {
    if (mapContainer.current === null) {
      return;
    }
    console.log("creating map");
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11", // Choose your desired Mapbox style
    });

    const onStyleLoad = () => {
      setStyleLoaded((curr) => curr + 1);
    };

    mapRef.current.on("style.load", onStyleLoad);

    setIsMapLoaded(true);

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        console.log("cleaning up");
        mapRef.current.off("style.load", onStyleLoad);
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (
      !mapRef.current ||
      !isMapLoaded ||
      !gpsCoordinates ||
      styleLoaded === currentStyle
    ) {
      return;
    }
    const boundingBox = getBoundingBox(gpsCoordinates);
    mapRef.current.fitBounds(
      [
        [boundingBox[0], boundingBox[1]],
        [boundingBox[2], boundingBox[3]],
      ],
      {
        padding: 40,
        animate: false,
      }
    );
    addRouteLayers(mapRef.current, gpsCoordinates);
    addStartAndFinishMarkers(mapRef.current, gpsCoordinates);
    setCurrentStyle(styleLoaded);
  }, [gpsCoordinates, isMapLoaded, styleLoaded, currentStyle]);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) {
      return;
    }
    mapRef.current.setStyle(
      showSatellite
        ? "mapbox://styles/wahoofitness/cl4dx96v9000214paveyigd40"
        : "mapbox://styles/wahoofitness/cl4fyecjv000015s7svqrat0r"
    );
  }, [showSatellite, isMapLoaded]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}

export default MapComponent;
