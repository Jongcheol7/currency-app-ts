"use client";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { useEffect, useState, useRef, useCallback } from "react";

// Google Maps에 로드할 라이브러리
const libraries: "places"[] = ["places"];
const mapContainerStyle = { width: "100%", height: "80vh" };

// PlaceResult 타입을 직접 정의 (빌드 오류 방지용)
type CleanPlace = {
  name?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
};

export default function ExchangeMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 서울
  const [places, setPlaces] = useState<CleanPlace[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const searchNearby = useCallback((pos: { lat: number; lng: number }) => {
    setCenter(pos);

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.nearbySearch(
      {
        location: pos,
        radius: 1500,
        keyword: "currency exchange",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // 결과를 CleanPlace[] 형태로 가공
          const cleanResults: CleanPlace[] = results.map((place) => ({
            name: place.name,
            geometry: {
              location: {
                lat: () => place.geometry?.location?.lat?.() ?? 0,
                lng: () => place.geometry?.location?.lng?.() ?? 0,
              },
            },
          }));
          setPlaces(cleanResults);
        }
      }
    );
  }, []);

  const handleRecenter = () => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    if (!center) return;
    searchNearby({ lat: center.lat(), lng: center.lng() });
  };

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    const location = place.geometry?.location;
    if (!location) return;

    const pos = {
      lat: location.lat(),
      lng: location.lng(),
    };
    searchNearby(pos);
  };

  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      searchNearby(pos);
    });
  }, [isLoaded, searchNearby]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative">
      {/* 검색창 */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded shadow px-3 py-2 w-72">
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="장소 검색 (예: 강남역)"
            className="w-full p-2 border rounded outline-none"
          />
        </Autocomplete>
      </div>

      {/* 현재 위치 재검색 버튼 */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-10 bg-white border px-3 py-1 rounded shadow hover:bg-gray-100 transition"
      >
        현재 지도 위치로 재검색
      </button>

      {/* 지도 */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        onLoad={onLoadMap}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          scrollwheel: true,
        }}
      >
        {places.map((place, i) => (
          <Marker
            key={i}
            position={{
              lat: place.geometry?.location?.lat?.() ?? 0,
              lng: place.geometry?.location?.lng?.() ?? 0,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
