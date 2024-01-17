import React from "react";
import RenderHistory from "../components-overview/History/RenderHistory";


const CropRotation = ({ farm }) => {
  //const theme = useTheme();

  return (
    <div style={{
      display: "flex",
      height: "calc(100vh - 60px)"
    }}>
      <RenderHistory
        selectedFarmId={farm}
      />
    </div>
  );
};

export default CropRotation;
