'use client';

import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import { useEffect } from 'react';

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  mode: 'city' | 'address';
  cityFilter?: string; // Used only in address mode
}

export default function AutocompleteInput({
  value,
  onChange,
  placeholder,
  mode,
  cityFilter,
}: AutocompleteInputProps) {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'it' },
    },
    debounce: 300,
  });

  useEffect(() => {
    setValue(value, false);
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const components = results[0]?.address_components;

      if (mode === 'city') {
        const cityComponent = components?.find((c) =>
          c.types.includes('locality') || c.types.includes('postal_town')
        );
        const longName = cityComponent?.long_name || description;
        console.log('CITY long_name:', longName);
setValue(longName, false);
        onChange(longName);
      }

      if (mode === 'address') {
        const route = components?.find((c) => c.types.includes('route'))?.long_name || '';
        const number = components?.find((c) => c.types.includes('street_number'))?.long_name || '';
        const cleaned = `${route} ${number}`.trim();
        console.log('ADDRESS cleaned:', cleaned);
setValue(cleaned || description, false);
        onChange(cleaned || description);
      }
    } catch (err) {
      console.error('Failed to geocode', err);
      onChange(description); // fallback
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && data.length > 0) {
      e.preventDefault();
      await handleSelect(data[0].description);
    }
  };

  const filteredData =
    mode === 'address' && cityFilter
      ? data.filter((s) => s.description.toLowerCase().includes(cityFilter.toLowerCase()))
      : data;

  return (
    <div className="relative">
      <input
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={!ready}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded"
      />
      {status === 'OK' && filteredData.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-60 overflow-y-auto shadow">
          {filteredData.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}