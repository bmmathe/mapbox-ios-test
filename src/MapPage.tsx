import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "./MapComponent";
import { useEffect, useState } from "react";
import DirtySheetz from "./assets/DirtySheetz.json";
import { RouteRecord } from "./RouteRecord";
import PeachtreeRoadRace from "./assets/PeachtreeRoadRace.json";
import { FaMap, FaSatellite } from "react-icons/fa";

function MapPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [routeJson, setRouteJson] = useState<RouteRecord[]>([]);
  const [showSatellite, setShowSatellite] = useState(false);
  const back = () => {
    navigate("/");
  };
  useEffect(() => {
    if (params.id === "1") {
      setRouteJson(DirtySheetz.records);
    } else {
      setRouteJson(PeachtreeRoadRace.records);
    }
  }, [params.id]);
  return (
    <div className="flex flex-col h-[100dvh] w-[100dvw] gap-2 p-2">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
        onClick={back}
      >
        Back
      </button>
      <div className="w-full h-full relative">
        <MapComponent routeJson={routeJson} showSatellite={showSatellite} />
        <div className="absolute top-0 right-0 p-2 z-10">
          <button
            onClick={() => setShowSatellite((curr) => !curr)}
            className="p-0 w-12 h-12 bg-blue-500 rounded-full shadow transition ease-in duration-200"
          >
            {showSatellite ? (
              <FaMap size={24} className="w-6 h-6 inline-block text-white" />
            ) : (
              <FaSatellite
                size={24}
                className="w-6 h-6 inline-block text-white"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
