/**
 * Utility to fetch Indian City, District, and State details from a 6-digit Pincode
 * Uses the free public Postal Pincode API (https://api.postalpincode.in/pincode/{PINCODE})
 */
export async function lookupPincode(pincode) {
  const cleanPin = (pincode || '').toString().replace(/\D/g, '');
  if (cleanPin.length !== 6) {
    return { success: false, error: 'Pincode must be 6 digits' };
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0 && data[0].Status === 'Success' && Array.isArray(data[0].PostOffice) && data[0].PostOffice.length > 0) {
      const po = data[0].PostOffice[0];
      return {
        success: true,
        city: po.Name || po.Block || po.District,
        district: po.District || '',
        state: po.State || '',
        country: po.Country || 'India',
        postOffices: data[0].PostOffice.map(p => p.Name)
      };
    } else {
      return { success: false, error: 'Invalid or unrecognized Indian Pincode' };
    }
  } catch (err) {
    console.error('Pincode lookup error:', err);
    return { success: false, error: 'Could not fetch pincode details' };
  }
}
