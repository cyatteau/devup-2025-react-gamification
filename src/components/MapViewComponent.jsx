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

const MapViewComponent = ({
  location,
  landmarks,
  selectedBasemap,
  // no more questStarted or index props
}) => {
  const mapDiv = useRef(null);

  esriConfig.apiKey = "AAPKc0a534840fb6404cb4e7350c842f2f137WNlQPzeGdDeqztxzZ_1U4PM9qnN5JKH1H9HF64M3KLjYCNgZ1p3szK3qlcCXJvX";
  const WGS84 = { wkid: 4326 };

  const kmDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (
      !location ||
      location.longitude == null ||
      location.latitude == null ||
      !mapDiv.current
    )
      return;

    const basemapLayer = new VectorTileLayer({
      portalItem: { id: selectedBasemap },
    });
    const basemap = new Basemap({ baseLayers: [basemapLayer] });
    const map = new Map({ basemap });
    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [location.longitude, location.latitude],
      zoom: 13,
    });
    view.popup.autoOpenEnabled = false;

    view.when(() => {
      // user marker + radius
      view.graphics.addMany([
        new Graphic({
          geometry: {
            type: "point",
            x: location.longitude,
            y: location.latitude,
            spatialReference: WGS84,
          },
          symbol: new SimpleMarkerSymbol({ color: "red", size: 15 }),
        }),
        new Graphic({
          geometry: new Circle({
            center: [location.longitude, location.latitude],
            radius: 1609.34,
            geodesic: true,
            spatialReference: WGS84,
          }),
          symbol: new SimpleFillSymbol({
            color: [51, 51, 204, 0.15],
            outline: { color: [51, 51, 204, 0.5], width: 2 },
          }),
        }),
      ]);

      // land­mark graphics
      const graphics = landmarks
        .filter(
          (lm) =>
            kmDistance(
              location.latitude,
              location.longitude,
              lm.coordinates.latitude,
              lm.coordinates.longitude
            ) <= 1.60934
        )
        .map(
          (lm, i) =>
            new Graphic({
              geometry: {
                type: "point",
                x: lm.coordinates.longitude,
                y: lm.coordinates.latitude,
                spatialReference: WGS84,
              },
              attributes: {
                name: lm.name,
                address: lm.address,
                description: lm.description,
              },
              symbol: new SimpleMarkerSymbol({ color: "blue", size: 15 }),
            })
        );

      const landmarkLayer = new FeatureLayer({
        source: graphics,
        objectIdField: "objectId",
        fields: [
          { name: "objectId", type: "oid" },
          { name: "name", type: "string" },
          { name: "address", type: "string" },
          { name: "description", type: "string" },
        ],
        geometryType: "point",
        spatialReference: WGS84,
        renderer: {
          type: "simple",
          symbol: new SimpleMarkerSymbol({ color: "blue", size: 15 }),
        },
        popupTemplate: new PopupTemplate({
          title: "{name}",
          content: "<p><b>Address:</b> {address}</p><p>{description}</p>",
        }),
      });
      map.add(landmarkLayer);
    });

    return () => view.destroy();
  }, [location, landmarks, selectedBasemap]);

  return <div ref={mapDiv} style={{ height: "60vh", width: "100%" }} />;
};

export default MapViewComponent;
