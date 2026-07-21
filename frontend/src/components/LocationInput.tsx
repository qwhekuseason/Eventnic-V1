import React, { useState, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCoordinates: (coords: { lat: number, lng: number } | null) => void;
  placeholder?: string;
}

export default function LocationInput({ value, onChange, onSelectCoordinates, placeholder }: LocationInputProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed */
    },
    debounce: 300,
    defaultValue: value,
    initOnMount: isLoaded,
  });

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value !== inputValue) {
      setValue(value, false);
    }
  }, [value, setValue, inputValue]);

  if (loadError) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md"
        placeholder={placeholder}
        type="text"
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-11 px-md rounded-lg border border-outline-variant bg-surface-container flex items-center text-secondary">
        Loading Maps...
      </div>
    );
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    setShowDropdown(true);
    if (e.target.value === '') {
      onSelectCoordinates(null);
    }
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    onChange(address);
    clearSuggestions();
    setShowDropdown(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelectCoordinates({ lat, lng });
    } catch (error) {
      console.error("Error: ", error);
      onSelectCoordinates(null);
    }
  };

  return (
    <div className="relative">
      <input
        value={inputValue}
        onChange={handleInput}
        disabled={!ready}
        className="w-full h-11 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all text-body-md"
        placeholder={placeholder}
        type="text"
      />
      {status === "OK" && showDropdown && (
        <ul className="absolute z-10 mt-1 w-full bg-surface border border-outline-variant rounded-lg shadow-lg max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-md py-sm hover:bg-surface-container cursor-pointer text-body-md border-b border-outline-variant last:border-0"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
