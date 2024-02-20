// import { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import { Map as OlMap, View, Overlay } from "ol";
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
import PinGreen from "@/assets/pin_green.png";
import axios from "axios";
import { Select } from "ol/interaction";

interface center {
  name: string;
  lat: string;
  lng: string;
  visitDate: string;
}

const { kakao } = window;

function App() {
  const [mapObj, setMapObj] = useState<Map | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  // const vectorSource = new VectorLayer({
  //   source: markerSource,
  //   // style: new Style({
  //   //   image: new Icon({
  //   //     src: PinGreen,
  //   //     scale: 0.7, // 마커 크기 조절
  //   //   }),
  //   // }),
  // });

  useEffect(() => {
    if (!overlayRef.current) return;
    // Map 객체 생성 및 OSM 배경지도 추가
    // if (!mapObj) {
    const map = new OlMap({
      controls: defaultControls({ zoom: false, rotate: false }).extend([]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        // vectorSource,
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
          src: PinGreen,
          scale: 0.7, // 마커 크기 조절
        }),
      }),
    });

    // 지도에 마커 레이어 추가
    map.addLayer(markerLayer);

    setMapObj(map);

    const overlay = new Overlay({
      element: overlayRef.current as HTMLElement,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(overlay);

    const select = new Select({
      layers: [markerLayer],
    });
    map.addInteraction(select);

    select.on("select", (e) => {
      if (e.selected.length > 0) {
        const coordinate = (
          e.selected[0].getGeometry() as Point
        ).getCoordinates();
        overlay.setPosition(coordinate);
        // InfoWindow에 표시할 내용 설정
        if (overlayRef.current)
          overlayRef.current.innerHTML = "Info Window Content";
      } else {
        overlay.setPosition(undefined);
        // 마커 외 다른 곳 클릭시 InfoWindow 닫기
        if (overlayRef.current) overlayRef.current.innerHTML = "";
      }
    });

    // map.on("click", function (evt) {
    //   const coordinate = evt.coordinate;
    //   overlay.setPosition(coordinate);
    //   // 여기서 InfoWindow에 표시할 내용을 설정합니다.
    //   // 예를 들어,
    //   if (overlayRef.current) {
    //     overlayRef.current.innerHTML = "Info Window Content";
    //   }
    //   // 로 설정할 수 있습니다.
    // });

    return () => map.setTarget(undefined);
    // }
  }, []);

  // useEffect(() => {
  //   const ps = new kakao.maps.services.Places();
  //   ps.keywordSearch("클라이밍", placesSearchCB);

  //   // 키워드 검색 완료 시 호출되는 콜백함수
  //   function placesSearchCB(data, status, pagination) {
  //     console.log(data);
  //     console.log(status);
  //     console.log(pagination);
  //   }
  // }, []);

  const fetchTest = async () => {
    const res = await axios.get("http://localhost:3000");
    // console.log("fetchTest", res);
    // console.log(res.data);
  };
  useEffect(() => {
    fetchTest();
  }, []);

  return (
    <>
      <div
        id="map"
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      ></div>
      <div
        ref={overlayRef}
        className="overlay"
        style={{
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          padding: "10px",
        }}
      />
    </>
  );
}

export default App;
