"use client";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { useEffect, useState, useRef, useCallback } from "react";

const libraries: "places"[] = ["places"];
const mapContainerStyle = { width: "100%", height: "80vh" };

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

  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [places, setPlaces] = useState<CleanPlace[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  const handleFindMe = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentLocation(pos);
      setCenter(pos);
      searchNearby(pos);
    });
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
      setCurrentLocation(pos);
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

      {/* 현재 지도 위치로 재검색 */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-10 bg-white border px-3 py-1 rounded shadow hover:bg-gray-100 transition"
      >
        현재 지도 위치로 재검색
      </button>

      {/* 내 위치 찾기 */}
      <button
        onClick={handleFindMe}
        className="absolute bottom-4 left-4 z-10 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-600"
      >
        내 위치 찾기
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
        {/* 내 위치 마커 */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
            }}
          />
        )}

        {/* 환전소 마커 */}
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
