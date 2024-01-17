// import { useContext } from "react";
import { useState, useEffect } from "react";
import "ol/ol.css";
import { Map as OlMap, View } from "ol";
import type { Map } from "ol";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Icon, Style } from "ol/style.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import CarEmpty from '@/assets/car_empty.png'

function App() {
  const [mapObj, setMapObj] = useState<Map | null>(null);

  const iconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: "Null Island",
    population: 4000,
    rainfall: 500,
  });

  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: "./src/assets/car_empty.png",
    }),
  });

  iconFeature.setStyle(iconStyle);
  
  const markerSource = new VectorSource({
    features: [
      new Feature({
        geometry: new Point(fromLonLat([126.965, 37.5307])),
      }),
    ],
  });

  const vectorSource = new VectorLayer({
    source: markerSource,
    style: new Style({
      image: new Icon({
        src: CarEmpty,
        scale: 0.1, // 마커 크기 조절
      }),
    }),
  }); 

  useEffect(() => {
    // Map 객체 생성 및 OSM 배경지도 추가
    // if (!mapObj) {
    const map = new OlMap({
      controls: defaultControls({ zoom: false, rotate: false }).extend([]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorSource,
      ],
      target: "map", // 하위 요소 중 id 가 map 인 element가 있어야함.
      view: new View({
        // projection: getProjection("EPSG:3857"),
        center: fromLonLat(
          [126.965, 37.5307]
          // getProjection("EPSG:3857")
        ),
        zoom: 15,
      }),
    });

    // 마커 생성
    const markerSource = new VectorSource({
      features: [
        new Feature({
          geometry: new Point(fromLonLat([126.965, 37.5307])),
        }),
      ],
    });

    const markerLayer = new VectorLayer({
      source: markerSource,
      style: new Style({
        image: new Icon({
          src: "./car.png",
          scale: 5.1, // 마커 크기 조절
        }),
      }),
    });

    // 지도에 마커 레이어 추가
    map.addLayer(markerLayer);

    setMapObj(map);
    return () => map.setTarget(undefined);
    // }
  }, []);

  return (
    <div
      id="map"
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    ></div>
  );
}

export default App;
