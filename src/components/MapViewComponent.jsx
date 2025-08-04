// src/components/MapViewComponent.jsx
import React, { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Basemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Circle from "@arcgis/core/geometry/Circle";
import esriConfig from "@arcgis/core/config";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { useAppContext } from "../AppContext";

const MapViewComponent = ({ location, landmarks, selectedBasemap }) => {
  const { state } = useAppContext();
  const mapDiv = useRef(null);

  esriConfig.apiKey = "AAPKc0a534840fb6404cb4e7350c842f2f137WNlQPzeGdDeqztxzZ_1U4PM9qnN5JKH1H9HF64M3KLjYCNgZ1p3szK3qlcCXJvX";

  // Utility to compute distance in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) **
          2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (!location || !mapDiv.current) return;

    // Basemap setup
    const basemapLayer = new VectorTileLayer({
      portalItem: { id: selectedBasemap },
    });
    const basemap = new Basemap({ baseLayers: [basemapLayer] });

    // Create the map and view
    const map = new Map({ basemap });
    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [location.longitude, location.latitude],
      zoom: 13,
    });

    // Add user location marker and radius circle
    const userMarker = new Graphic({
      geometry: {
        type: "point",
        longitude: location.longitude,
        latitude: location.latitude,
      },
      symbol: new SimpleMarkerSymbol({ color: "red", size: "15px" }),
    });

    const radius = new Circle({
      center: [location.longitude, location.latitude],
      radius: 1609.34,
      geodesic: true,
    });
    const circleGraphic = new Graphic({
      geometry: radius,
      symbol: new SimpleFillSymbol({
        color: [51, 51, 204, 0.15],
        outline: { color: [51, 51, 204, 0.5], width: 2 },
      }),
    });

    view.graphics.addMany([userMarker, circleGraphic]);

    // Build Features for landmarks within 1 mile
    const features = landmarks
      .filter((lm) => {
        const dist = calculateDistance(
          location.latitude,
          location.longitude,
          lm.coordinates.latitude,
          lm.coordinates.longitude
        );
        return dist <= 1.60934;
      })
      .map((lm, idx) => {
        return new Graphic({
          geometry: {
            type: "point",
            longitude: lm.coordinates.longitude,
            latitude: lm.coordinates.latitude,
          },
          attributes: {
            objectId: idx + 1,
            name: lm.name,
            address: lm.address,
            description: lm.description,
          },
        });
      });

    // FeatureLayer for landmarks with popupTemplate
    const landmarkLayer = new FeatureLayer({
      source: features,
      objectIdField: "objectId",
      fields: [
        { name: "objectId", type: "oid" },
        { name: "name", type: "string" },
        { name: "address", type: "string" },
        { name: "description", type: "string" },
      ],
      geometryType: "point",
      spatialReference: view.spatialReference,
      renderer: {
        type: "simple",
        symbol: new SimpleMarkerSymbol({ color: "blue", size: "15px" }),
      },
      popupTemplate: new PopupTemplate({
        title: "{name}",
        content:
          "<p><b>Address:</b> {address}</p><p><b>Description:</b> {description}</p>",
      }),
    });

    // Add the FeatureLayer to the map
    map.add(landmarkLayer);

    return () => view.destroy();
  }, [location, landmarks, selectedBasemap]);

  return <div ref={mapDiv} style={{ height: "60vh", width: "100%" }} />;
};

export default MapViewComponent;
