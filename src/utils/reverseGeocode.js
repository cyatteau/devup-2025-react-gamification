const reverseGeocode = async (longitude, latitude, apiKey) => {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${longitude},${latitude}&token=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      console.log(data)
      return data.address.LongLabel;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  };
  
  export default reverseGeocode;
  