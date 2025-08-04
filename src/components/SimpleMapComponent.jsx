import React, { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

const SimpleMapComponent = React.memo(({ selectedBasemap }) => {
  esriConfig.apiKey =
    "AAPKc0a534840fb6404cb4e7350c842f2f137WNlQPzeGdDeqztxzZ_1U4PM9qnN5JKH1H9HF64M3KLjYCNgZ1p3szK3qlcCXJvX";

  const mapDiv = useRef(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    const customBasemapLayer = new VectorTileLayer({
      portalItem: {
        id: selectedBasemap,
      },
    });

    const map = new Map({
      basemap: {
        baseLayers: [customBasemapLayer],
      },
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [0, 0],
      zoom: 2,
    });

    return () => {
      view.destroy();
    };
  }, [selectedBasemap]);

  return <div ref={mapDiv} style={{ height: "60vh", width: "100%" }} />;
});

export default SimpleMapComponent;
