// Function to get location from IP
async function getGeoLocation(ip) {
  try {
    const res = await fetch(
      `http://api.ipapi.com/api/${ip}?access_key=${process.env.IPAPI_ACCESS_KEY}`
    );
    const data = await res.json();
    console.log("location data: \n", data);
    return `${data.city}, ${data.region}, ${data.country_name}`;
  } catch (error) {
    console.error("Error fetching location: \n", error);
    return "Unknown Location";
  }
}

export { getGeoLocation };
