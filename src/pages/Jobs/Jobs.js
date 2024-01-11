import { React, useState } from "react";
import Map from "../components-overview/component/Map";
import RenderJobs from "../components-overview/Jobs/RenderJobs";


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
  const handleDrawingManager = (drawingManager) => {
    // Update the drawing manager reference
    drawingManager.setDrawingMode(null);
  };

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 60px)"
      }}>
        <RenderJobs
          farm={farm}
          season={season}
        />
        <Map
          handleCoordinatesChange={handleCoordinatesChange}
          setIsDialogOpen={setIsDialogOpen}
          handleMapLoad={handleMapLoad}
          handleDrawingManager={handleDrawingManager}
        />
      </div>
    </>
  );
};


export default Jobs;
