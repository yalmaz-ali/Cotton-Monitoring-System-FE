import { React, useState } from "react";
import Map from "./component/Map";
import RenderJobs from "./component/Jobs/RenderJobs";


const Jobs = ({ farm, season }) => {
  const [coordinates, setCoordinates] = useState([]); // Coordinates state
  const [mainMap, setMainMap] = useState(null); // Map reference state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates); // Update the coordinates
  };
  const handleMapLoad = (map) => {
    setMainMap(map); // Update the map reference
  };

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        height: "91vh",
      }}>
        <RenderJobs
          farm={farm}
          season={season}
        />
        <Map
          handleCoordinatesChange={handleCoordinatesChange}
          setIsDialogOpen={setIsDialogOpen}
          handleMapLoad={handleMapLoad}
        />
      </div>
    </>
  );
};


export default Jobs;
