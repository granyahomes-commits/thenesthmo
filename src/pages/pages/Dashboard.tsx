import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  Plus,
  Eye,
  MessageSquare,
  Home,
  DoorOpen,
  AlertCircle,
} from "lucide-react";

interface Property {
  id: string;
  address_line_1: string;
  city: string;
  postcode: string;
  total_rooms: number;
  status: string;
  hmo_licence_number: string | null;
  rooms: Room[];
}

interface Room {
  id: string;
  title: string | null;
  room_type: string;
  rent_pcm: number;
  status: string;
  views_count: number;
  enquiries_count: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchProperties();
    }
  }, [user, authLoading]);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        rooms (*)
      `)
      .eq("landlord_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading properties",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProperties((data as Property[]) || []);
    }
    setLoading(false);
  };

  const totalRooms = properties.reduce(
    (sum, p) => sum + (p.rooms?.length || 0),
    0
  );
  const availableRooms = properties.reduce(
    (sum, p) =>
      sum + (p.rooms?.filter((r) => r.status === "available").length || 0),
    0
  );
  const totalViews = properties.reduce(
    (sum, p) =>
      sum + (p.rooms?.reduce((rs, r) => rs + (r.views_count || 0), 0) || 0),
    0
  );
  const totalEnquiries = properties.reduce(
    (sum, p) =>
      sum +
      (p.rooms?.reduce((rs, r) => rs + (r.enquiries_count || 0), 0) || 0),
    0
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile?.full_name
                  ? `Welcome, ${profile.full_name}`
                  : "Landlord Dashboard"}
              </h1>
              <p className="text-primary-foreground/70 mt-1">
                Manage your HMO properties and rooms
              </p>
            </div>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-fit"
              asChild
            >
              <Link to="/properties/new">
                <Plus size={18} className="mr-2" />
                Add Property
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Home className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{properties.length}</p>
                  <p className="text-xs text-muted-foreground">Properties</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DoorOpen className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {availableRooms}/{totalRooms}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rooms Available
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Eye className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {totalViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalEnquiries}</p>
                  <p className="text-xs text-muted-foreground">Enquiries</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Properties List */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {properties.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building2
                  className="mx-auto text-muted-foreground mb-4"
                  size={48}
                />
                <h3 className="text-lg font-semibold mb-2">
                  No properties yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add your first HMO property to start listing rooms and
                  receiving tenant enquiries.
                </p>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  asChild
                >
                  <Link to="/properties/new">
                    <Plus size={18} className="mr-2" />
                    Add Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-soft transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">
                            {property.address_line_1}
                          </h3>
                          <Badge
                            className={
                              property.status === "active"
                                ? "bg-success"
                                : "bg-secondary"
                            }
                          >
                            {property.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {property.city}, {property.postcode}
                        </p>
                        {property.hmo_licence_number && (
                          <p className="text-xs text-muted-foreground mt-1">
                            HMO Licence: {property.hmo_licence_number}
                          </p>
                        )}
                      </div>

                      {/* Room summary */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">
                            {property.rooms?.length || 0}
                          </p>
                          <p className="text-muted-foreground">Rooms</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">
                            {property.rooms
                              ?.filter((r) => r.status === "available")
                              .length || 0}
                          </p>
                          <p className="text-muted-foreground">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">
                            {property.rooms?.reduce(
                              (s, r) => s + (r.enquiries_count || 0),
                              0
                            ) || 0}
                          </p>
                          <p className="text-muted-foreground">Enquiries</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/properties/${property.id}`}>Manage</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Rooms table */}
                    {property.rooms && property.rooms.length > 0 && (
                      <div className="mt-4 border-t border-border pt-4">
                        <div className="space-y-2">
                          {property.rooms.map((room) => (
                            <div
                              key={room.id}
                              className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-secondary/30"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">
                                  {room.title || `${room.room_type} room`}
                                </span>
                                <span className="text-muted-foreground">
                                  £{room.rent_pcm}/mo
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Eye size={14} /> {room.views_count || 0}
                                </span>
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <MessageSquare size={14} />{" "}
                                  {room.enquiries_count || 0}
                                </span>
                                <Badge
                                  variant={
                                    room.status === "available"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    room.status === "available"
                                      ? "bg-success"
                                      : ""
                                  }
                                >
                                  {room.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
