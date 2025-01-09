import React, { useState, useEffect } from "react";
import { Card, AutoComplete, Button, Typography, Space, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

const LocationPicker = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: 21.0285, // Default to Hanoi coordinates
    lng: 105.8542,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    // Load Google Maps script with places library
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    const mapInstance = new window.google.maps.Map(
      document.getElementById("map"),
      {
        center: coordinates,
        zoom: 15,
      }
    );

    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      position: coordinates,
      draggable: true,
    });

    // Initialize Places services
    setAutocompleteService(new window.google.maps.places.AutocompleteService());
    setPlacesService(new window.google.maps.places.PlacesService(mapInstance));

    // Update coordinates when marker is dragged
    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      const newCoordinates = {
        lat: position.lat(),
        lng: position.lng(),
      };
      setCoordinates(newCoordinates);
      getAddressFromCoordinates(newCoordinates);
    });

    // Click on map to set marker
    mapInstance.addListener("click", (event) => {
      const newCoordinates = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      markerInstance.setPosition(newCoordinates);
      setCoordinates(newCoordinates);
      getAddressFromCoordinates(newCoordinates);
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const getAddressFromCoordinates = async (coords) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  };

  const handleSearch = async (value) => {
    if (!value || !autocompleteService) return;

    setLoading(true);

    try {
      const result = await new Promise((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: "vn" }, // Giới hạn kết quả ở Việt Nam
          },
          (predictions, status) => {
            if (status === "OK") resolve(predictions);
            else reject(status);
          }
        );
      });

      const suggestions = result.map((place) => ({
        value: place.place_id,
        label: place.description,
      }));

      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (placeId, option) => {
    if (!placesService) return;

    setLoading(true);

    try {
      const result = await new Promise((resolve, reject) => {
        placesService.getDetails(
          {
            placeId: placeId,
            fields: ["formatted_address", "geometry"],
          },
          (place, status) => {
            if (status === "OK") resolve(place);
            else reject(status);
          }
        );
      });

      const newCoordinates = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      };

      setCoordinates(newCoordinates);
      setAddress(result.formatted_address);
      map.setCenter(newCoordinates);
      marker.setPosition(newCoordinates);
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "100%", maxWidth: "800px" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <AutoComplete
          value={address}
          options={suggestions}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onChange={setAddress}
          placeholder="Nhập địa chỉ để tìm kiếm..."
          style={{ width: "100%" }}
          notFoundContent={
            loading ? <Spin size="small" /> : "Không tìm thấy kết quả"
          }
        />

        <div
          id="map"
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
        />

        {coordinates && (
          <Space direction="vertical">
            <Text type="secondary">
              Tọa độ: {coordinates.lat}, {coordinates.lng}
            </Text>
            <Text type="secondary">Địa chỉ: {address}</Text>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default LocationPicker;
