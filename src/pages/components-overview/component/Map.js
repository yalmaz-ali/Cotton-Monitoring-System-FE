import Cookies from 'js-cookie';
import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Map({
    handleCoordinatesChange,
    setIsDialogOpen,
    handleMapLoad
}) {
    let [mainMap, setMainMap] = useState(null);
    const [coordinates, setCoordinates] = useState([]);

    function InitMap() {

        var Location = new window.google.maps.LatLng(31.402300, 74.210191);
        var mapOptions = {
            zoom: 17,
            center: Location,
            mapTypeId: "hybrid",
            mapTypeControl: false, // Set mapTypeControl to false to remove the map type control
            streetViewControl: false, // Set streetViewControl to false to remove the Pegman control
            zoomControlOptions: { position: window.google.maps.ControlPosition.TOP_LEFT } // Set zoomControlOptions to move the zoom controls to the top left corner

        }

        mainMap = new window.google.maps.Map(document.getElementById("mapcanvas"), mapOptions);
        setMainMap(mainMap);
        handleMapLoad(mainMap);

        var all_overlays = [];
        var selectedShape;

        // if (drawPolygon) {
        //     console.log("drawPolygon:", drawPolygon);
        //     drawingMode = true;
        //     drawingPolygon = new window.google.maps.Polygon({
        //         map: mainMap,
        //         editable: true,
        //         fillColor: '#ffff00',
        //         fillOpacity: 0.5,
        //         clickable: true,
        //         draggable: false,
        //     })
        // }

        var drawingManager = new window.google.maps.drawing.DrawingManager({
            drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    window.google.maps.drawing.OverlayType.POLYGON,
                ]
            },
            polygonOptions: {
                clickable: true,
                draggable: false,
                editable: true,
                fillColor: '#ffff00',
                fillOpacity: 0.5,
            },
        });

        function clearSelection() {
            if (selectedShape) {
                selectedShape.setEditable(false);
                selectedShape = null;
            }
        }

        //to disable drawing tools
        function stopDrawing() {
            drawingManager.setMap(null);
        }

        function setSelection(shape) {
            clearSelection();
            stopDrawing()
            selectedShape = shape;
            shape.setEditable(true);
        }

        function deleteSelectedShape() {
            if (selectedShape) {
                selectedShape.setMap(null);
                drawingManager.setMap(mainMap);
                coordinates.splice(0, coordinates.length)
                console.log(coordinates);
                // document.getElementById('info').innerHTML = ""
            }
        }

        function addSelectedShape() {
            setIsDialogOpen(true); // Open the dialog for field name input
            // deleteSelectedShape();
            selectedShape.setMap(null);
            drawingManager.setMap(mainMap);
            // document.getElementById('info').innerHTML = ""
            mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
            mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
        }

        function CenterControl(controlDiv, mainMap) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '5px';
            controlUI.style.textAlign = 'center';
            controlUI.style.width = '70px';
            controlUI.style.marginRight = '10px';
            // controlUI.style.display = 'none';
            controlUI.title = 'Select to delete the poygon';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '13px';
            controlText.style.lineHeight = '28px';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = 'Delete';
            controlUI.appendChild(controlText);

            //to delete the polygon
            controlUI.addEventListener('click', function () {
                mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
                mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
                deleteSelectedShape();
            });
        }

        function CenterControl2(controlDiv, mainMap) {

            // Set CSS for the control border.
            var addUI = document.createElement('div');
            addUI.style.backgroundColor = '#fff';
            addUI.style.border = '2px solid #fff';
            addUI.style.borderRadius = '3px';
            addUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            addUI.style.cursor = 'pointer';
            addUI.style.marginBottom = '5px';
            addUI.style.textAlign = 'center';
            addUI.style.width = '70px';
            // addUI.style.display = 'none';
            addUI.title = 'Select to add the shape';
            controlDiv.appendChild(addUI);

            // Set CSS for the control interior.
            var addText = document.createElement('div');
            addText.style.color = 'rgb(25,25,25)';
            addText.style.fontFamily = 'Roboto,Arial,sans-serif';
            addText.style.fontSize = '13px';
            addText.style.lineHeight = '28px';
            addText.style.paddingLeft = '5px';
            addText.style.paddingRight = '5px';
            addText.innerHTML = 'Add';
            addUI.appendChild(addText);

            //to delete the polygon
            addUI.addEventListener('click', function () {
                addSelectedShape();

            });
        }

        drawingManager.setMap(mainMap);

        var getPolygonCoords = function (newShape) {

            coordinates.splice(0, coordinates.length)
            console.log(coordinates)

            var len = newShape.getPath().getLength();

            for (var i = 0; i < len; i++) {
                coordinates.push(newShape.getPath().getAt(i).toUrlValue(4))
            }
            // document.getElementById('info').innerHTML = coordinates


        }

        window.google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {

            mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
            mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv2);

            console.log("polygon");
            event.getPath().getLength();
            window.google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

            window.google.maps.event.addListener(event.getPath(), 'insert_at', function () {
                getPolygonCoords(event)
            });

            window.google.maps.event.addListener(event.getPath(), 'set_at', function () {
                getPolygonCoords(event)
            })
        })

        window.google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
            all_overlays.push(event)
            console.log(all_overlays);
            console.log("overlay");

            drawingManager.setDrawingMode(null);

            var newShape = event.overlay;
            newShape.type = event.type;
            window.google.maps.event.addListener(newShape, 'click', function () {
                console.log("clicked");
                setSelection(newShape);
            });
            setSelection(newShape);

        })

        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, mainMap);


        var centerControlDiv2 = document.createElement('div');
        var centerControl2 = new CenterControl2(centerControlDiv2, mainMap);

        setCoordinates(coordinates);
        handleCoordinatesChange(coordinates);
        // centerControlDiv.index = 1;

        // RenderFieldData();

    };


    useEffect(() => {
        // const script = document.createElement("script");
        // script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=InitMap`;
        // script.async = true;
        // script.defer = true;
        // window.InitMap = InitMap;
        // document.head.appendChild(script);

        // return () => {
        //     document.head.removeChild(script);
        // };
        InitMap();
    }, []);

    return (
        <div id="mapcanvas" style={{
            height: "100%",
            width: "75%"
        }}>
        </div>
    );
}

export default Map;
