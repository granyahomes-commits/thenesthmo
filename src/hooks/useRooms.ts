import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEventTracking } from "@/hooks/useEventTracking";

export interface RoomListing {
  id: string; title: string | null; room_type: string; rent_pcm: number;
  bills_included: boolean; ensuite: boolean; furnished: boolean;
  available_from: string | null; status: string; views_count: number;
  enquiries_count: number; description: string | null; created_at: string;
  property_id: string; address: string; city: string; postcode: string;
  postcode_district: string; images: string[];
}

const PAGE_SIZE = 12;

export function useRooms() {
  const [rooms, setRooms] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({ postcode: "", maxBudget: 1200, billsIncluded: null as boolean|null, ensuite: null as boolean|null, roomType: null as string|null, city: null as string|null });
  const { trackSearch } = useEventTracking();

  const fetchRooms = useCallback(async (filters: typeof currentFilters, pageNum: number, append = false) => {
    setLoading(true); setError(null);
    try {
      let query = supabase.from("rooms")
        .select(`id, title, room_type, rent_pcm, bills_included, ensuite, furnished, available_from, status, views_count, enquiries_count, description, created_at, property_id, properties!inner(address_line_1, city, postcode, postcode_district, status)`, { count: "exact" })
        .eq("status", "available").eq("properties.status", "active")
        .lte("rent_pcm", filters.maxBudget)
        .order("created_at", { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);
      if (filters.billsIncluded) query = query.eq("bills_included", true);
      if (filters.ensuite) query = query.eq("ensuite", true);
      if (filters.postcode) {
        const s = filters.postcode.trim().toUpperCase();
        query = query.or(`postcode_district.ilike.%${s}%,city.ilike.%${s}%,postcode.ilike.%${s}%`, { foreignTable: "properties" });
      }
      const { data, error: qErr, count } = await query;
      if (qErr) throw qErr;
      const transformed: RoomListing[] = (data || []).map((r: any) => ({
        id: r.id, title: r.title, room_type: r.room_type, rent_pcm: r.rent_pcm,
        bills_included: r.bills_included, ensuite: r.ensuite, furnished: r.furnished,
        available_from: r.available_from, status: r.status, views_count: r.views_count,
        enquiries_count: r.enquiries_count, description: r.description, created_at: r.created_at,
        property_id: r.property_id, address: r.properties.address_line_1, city: r.properties.city,
        postcode: r.properties.postcode, postcode_district: r.properties.postcode_district, images: [],
      }));
      if (transformed.length > 0) {
        const ids = transformed.map(r => r.id);
        const { data: imgs } = await supabase.from("room_images").select("room_id, image_url, display_order").in("room_id", ids).order("display_order");
        if (imgs) { const m = new Map<string,string[]>(); for (const i of imgs) { const e = m.get(i.room_id)||[]; e.push(i.image_url); m.set(i.room_id,e); } for (const r of transformed) r.images = m.get(r.id)||[]; }
      }
      if (append) setRooms(p => [...p, ...transformed]); else setRooms(transformed);
      setTotalCount(count || 0); setHasMore(transformed.length === PAGE_SIZE);
      if (filters.postcode && pageNum === 0) trackSearch(filters.postcode.toUpperCase(), { maxBudget: filters.maxBudget, resultsCount: count||0 });
    } catch (err: any) { setError(err.message || "Failed to load rooms"); } finally { setLoading(false); }
  }, [trackSearch]);

  useEffect(() => { fetchRooms(currentFilters, 0); }, []);
  const search = useCallback(async (f: typeof currentFilters) => { setCurrentFilters(f); setPage(0); await fetchRooms(f, 0); }, [fetchRooms]);
  const loadMore = useCallback(async () => { const n = page+1; setPage(n); await fetchRooms(currentFilters, n, true); }, [page, currentFilters, fetchRooms]);
  return { rooms, loading, error, totalCount, search, loadMore, hasMore };
}
