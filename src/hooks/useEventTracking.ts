import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Lightweight event tracking that feeds the intelligence engine
// Every search, view, enquiry, and favourite becomes a demand signal

type EventType =
  | "search"
  | "view"
  | "enquiry"
  | "favourite"
  | "unfavourite"
  | "listing_created"
  | "room_let"
  | "room_available";

interface TrackEventParams {
  eventType: EventType;
  roomId?: string;
  propertyId?: string;
  postcodeDistrict?: string;
  metadata?: Record<string, unknown>;
}

// Generate or retrieve a session ID for anonymous tracking
function getSessionId(): string {
  const key = "nest_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function useEventTracking() {
  const { user } = useAuth();

  const trackEvent = useCallback(
    async ({
      eventType,
      roomId,
      propertyId,
      postcodeDistrict,
      metadata,
    }: TrackEventParams) => {
      try {
        // Fire and forget — don't block the UI
        supabase
          .from("behaviour_events")
          .insert({
            event_type: eventType,
            user_id: user?.id || null,
            room_id: roomId || null,
            property_id: propertyId || null,
            postcode_district: postcodeDistrict || null,
            metadata: metadata || null,
            session_id: getSessionId(),
          })
          .then(({ error }) => {
            if (error) {
              console.warn("Event tracking failed:", error.message);
            }
          });
      } catch {
        // Silently fail — tracking should never break the user experience
      }
    },
    [user]
  );

  // Convenience methods
  const trackSearch = useCallback(
    (postcodeDistrict: string, filters?: Record<string, unknown>) => {
      trackEvent({
        eventType: "search",
        postcodeDistrict,
        metadata: { filters, timestamp: Date.now() },
      });
    },
    [trackEvent]
  );

  const trackView = useCallback(
    (roomId: string, postcodeDistrict: string) => {
      trackEvent({
        eventType: "view",
        roomId,
        postcodeDistrict,
        metadata: { timestamp: Date.now() },
      });
    },
    [trackEvent]
  );

  const trackEnquiry = useCallback(
    (roomId: string, postcodeDistrict: string) => {
      trackEvent({
        eventType: "enquiry",
        roomId,
        postcodeDistrict,
        metadata: { timestamp: Date.now() },
      });
    },
    [trackEvent]
  );

  const trackFavourite = useCallback(
    (roomId: string, postcodeDistrict: string, isFavourite: boolean) => {
      trackEvent({
        eventType: isFavourite ? "favourite" : "unfavourite",
        roomId,
        postcodeDistrict,
        metadata: { timestamp: Date.now() },
      });
    },
    [trackEvent]
  );

  const trackListingCreated = useCallback(
    (propertyId: string, postcodeDistrict: string, roomCount: number) => {
      trackEvent({
        eventType: "listing_created",
        propertyId,
        postcodeDistrict,
        metadata: { room_count: roomCount, timestamp: Date.now() },
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackSearch,
    trackView,
    trackEnquiry,
    trackFavourite,
    trackListingCreated,
  };
}
