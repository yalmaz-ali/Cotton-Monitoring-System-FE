/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';

function Map({
    handleMapLoad,
    handleDrawingManager,
    width,
    widthSmall
}) {
    const location = useLocation();
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const mapRef = useRef(null);
    const searchBoxRef = useRef(null);

    async function InitMap() {

        if (!window.google) {
            console.error('Google Maps JavaScript API failed to load.');
            return;
        }

        var Location = new window.google.maps.LatLng(31.402300, 74.210191);
        var mapOptions = {
            zoom: 17,
            center: Location,
            mapTypeId: "hybrid",
            clickableIcons: false,
            keyboardShortcuts: false,
            mapTypeControl: matchesXs ? false : true, // Set mapTypeControl to false to remove the map type control
            mapTypeControlOptions: {
                style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            streetViewControl: false, // Set streetViewControl to false to remove the Pegman control
            fullscreenControl: matchesXs ? false : true, // Set fullscreenControl to false to remove the Fullscreen control
        }

        var mainMap = new window.google.maps.Map(document.getElementById("map"), mapOptions);
        mapRef.current = mainMap;
        handleMapLoad(mainMap);

        var drawingManager = new window.google.maps.drawing.DrawingManager({
            drawingControl: false,
            polygonOptions: {
                clickable: true,
                draggable: true,
                editable: true,
                fillOpacity: 0,
                strokeColor: 'yellow',
                strokeOpacity: 1,
                strokeWeight: 2,
                zIndex: 1
            },
            drawingMode: null,
            Map: mainMap
        });

        handleDrawingManager(drawingManager);


        // Create the search box and link it to the UI element.
        var input = document.getElementById('header-search');
        var searchBox = new window.google.maps.places.SearchBox(input);
        searchBoxRef.current = searchBox;

        // Bias the SearchBox results towards current map's viewport.
        mainMap.addListener('bounds_changed', function () {
            searchBox.setBounds(mainMap.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }

            // For each place, get the icon, name and location.
            var bounds = new window.google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                // Create a marker for each place.
                // new window.google.maps.Marker({
                //     map: mainMap,
                //     title: place.name,
                //     position: place.geometry.location
                // });

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            mainMap.fitBounds(bounds);
        });


    };

    useEffect(() => {
        InitMap().catch(error => {
            console.error('Failed to initialize map:', error);
            // Handle error in your app's UI...
        });
    }, []);

    useEffect(() => {
        // const script = document.createElement("script");
        // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBPjBHXmDnGvJULgTBQFScAlMCqGZUe16g&libraries=drawing,geometry&callback=initMap`;
        // script.async = true;
        // script.defer = true;
        // document.head.appendChild(script);
        window.initMap = InitMap;

        // return () => {
        //     document.head.removeChild(script);
        // };
        InitMap();
    }, []);


    return (
        <div id="map" style={{
            height: "100%",
            width: matchesXs ? widthSmall : width,
            position: "relative"
        }}>
        </div>
    );
}

export default Map;
