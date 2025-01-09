import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, AutoComplete, Typography, Space, Spin } from "antd";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import _ from "lodash";

const { Text } = Typography;

// Cấu hình icon cho marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component để cập nhật vị trí marker
const MarkerPosition = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return <Marker position={position} />;
};

// Component để xử lý sự kiện click trên bản đồ
const MapEvents = ({ onMapClick }) => {
  const map = useMap();

  React.useEffect(() => {
    map.on("click", (e) => {
      onMapClick(e.latlng);
    });

    return () => {
      map.off("click");
    };
  }, [map, onMapClick]);

  return null;
};

const LocationPicker = ({ position_cur }) => {
  console.log(position_cur);
  const [position, setPosition] = useState(position_cur ? position_cur : null);
  console.log(position);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const debouncedSearchLocation = useCallback(
    _.debounce(async (value) => {
      if (!value) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&countrycodes=vn`,
          {
            headers: {
              "Accept-Language": "vi",
            },
          }
        );

        console.log(response);

        const suggestions = response.data.map((item) => ({
          value: `${item?.lat},${item?.lon}`,
          label: item?.display_name,
        }));

        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setLoading(false);
      }
    }, 500), // Delay 500ms
    []
  );

  const handleSearch = (value) => {
    debouncedSearchLocation(value);
  };

  // Lấy địa chỉ từ tọa độ
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "Accept-Language": "vi",
          },
        }
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  // Xử lý khi chọn địa điểm từ suggestions
  const handleSelect = (value, option) => {
    const coordinates = option.value.split(",");
    const position = {
      lat: coordinates[0],
      lng: coordinates[1],
    };

    console.log(position);
    setPosition(position);
    setAddress(option.label);
  };

  // Xử lý khi click trên bản đồ
  const handleMapClick = async (newPosition) => {
    setPosition(newPosition);
    await getAddressFromCoordinates(newPosition?.lat, newPosition?.lng);
  };

  useEffect(() => {
    setPosition(position_cur);
  }, [position_cur]);

  return (
    <Card style={{ width: "100%", maxWidth: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <AutoComplete
          value={address}
          options={suggestions}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onChange={(value) => setAddress(value)}
          placeholder="Nhập địa chỉ để tìm kiếm..."
          style={{ width: "100%" }}
          notFoundContent={
            loading ? <Spin size="small" /> : "Không tìm thấy kết quả"
          }
        />

        <div
          style={{
            height: 400,
            width: "100%",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {position && (
            <MapContainer
              center={position}
              zoom={100}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
              scrollWheelZoom={true}
            >
              <TileLayer
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition position={position} />
              <MapEvents onMapClick={handleMapClick} />
            </MapContainer>
          )}
        </div>

        {/* {position && (
          <Space direction="vertical">
            <Text type="secondary">
              Tọa độ: {position?.lat}, {position?.lng}
            </Text>
            <Text type="secondary">Địa chỉ: {address}</Text>
          </Space>
        )} */}
      </Space>
    </Card>
  );
};

export default LocationPicker;
