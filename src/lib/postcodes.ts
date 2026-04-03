// postcodes.io — free, no API key, unlimited usage
// Validates UK postcodes and returns geographic data

interface PostcodeResult {
  postcode: string;
  district: string;        // outward code e.g. "SL1"
  area: string;            // area code e.g. "SL"
  latitude: number;
  longitude: number;
  admin_district: string;  // local authority e.g. "Slough"
  region: string;          // e.g. "South East"
  country: string;
}

export async function validatePostcode(postcode: string): Promise<PostcodeResult | null> {
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`
    );
    const data = await res.json();

    if (data.status !== 200 || !data.result) {
      return null;
    }

    const r = data.result;
    const outward = r.outcode || postcode.split(" ")[0];
    const area = outward.replace(/[0-9]/g, "");

    return {
      postcode: r.postcode,
      district: outward,
      area,
      latitude: r.latitude,
      longitude: r.longitude,
      admin_district: r.admin_district || "",
      region: r.region || "",
      country: r.country || "England",
    };
  } catch (err) {
    console.error("Postcode validation error:", err);
    return null;
  }
}

export async function autocompletePostcode(partial: string): Promise<string[]> {
  if (partial.length < 2) return [];
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(partial)}/autocomplete`
    );
    const data = await res.json();
    return data.result || [];
  } catch {
    return [];
  }
}

export async function lookupMultiplePostcodes(
  postcodes: string[]
): Promise<Map<string, PostcodeResult>> {
  const results = new Map<string, PostcodeResult>();
  try {
    const res = await fetch("https://api.postcodes.io/postcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcodes: postcodes.slice(0, 100) }), // max 100
    });
    const data = await res.json();

    if (data.result) {
      for (const item of data.result) {
        if (item.result) {
          const r = item.result;
          const outward = r.outcode || r.postcode.split(" ")[0];
          results.set(r.postcode, {
            postcode: r.postcode,
            district: outward,
            area: outward.replace(/[0-9]/g, ""),
            latitude: r.latitude,
            longitude: r.longitude,
            admin_district: r.admin_district || "",
            region: r.region || "",
            country: r.country || "England",
          });
        }
      }
    }
  } catch (err) {
    console.error("Bulk postcode lookup error:", err);
  }
  return results;
}

// Extract postcode district from a full postcode
// "SL1 3AA" → "SL1", "M14 5RX" → "M14"
export function getPostcodeDistrict(postcode: string): string {
  return postcode.trim().toUpperCase().split(" ")[0];
}

// Extract postcode area from a full postcode
// "SL1 3AA" → "SL", "M14 5RX" → "M"
export function getPostcodeArea(postcode: string): string {
  return getPostcodeDistrict(postcode).replace(/[0-9]/g, "");
}
