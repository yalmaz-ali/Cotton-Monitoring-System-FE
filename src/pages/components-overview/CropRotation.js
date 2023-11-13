import RenderHistory from "./component/History/RenderHistory";


const CropRotation = ({ farm }) => {
  //const theme = useTheme();

  return (
    <div style={{
      display: "flex",
      height: "91vh",
    }}>
      <RenderHistory
        selectedFarmId={farm}
      />
    </div>
  );
};

export default CropRotation;
