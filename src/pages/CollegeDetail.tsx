import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  GraduationCap,
  Building2,
  TrendingUp,
  Home,
  Trophy,
  Users,
  Phone,
  Globe,
  Map,
  ArrowLeft,
  Maximize2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<{ title: string; content: string; icon: React.ReactNode } | null>(null);

  const { data: college, isLoading } = useQuery({
    queryKey: ["college", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const openMap = () => {
    if (college?.map_link) {
      window.open(college.map_link, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 max-w-5xl">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 text-center">
          <p className="text-lg text-muted-foreground">College not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Colleges
        </Button>

        {college.image_url && (
          <div className="h-96 rounded-xl overflow-hidden mb-8 shadow-elevated">
            <img
              src={college.image_url}
              alt={college.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold">{college.name}</h1>
              <Badge variant="secondary" className="text-base">
                <MapPin className="w-4 h-4 mr-1" />
                {college.district}
              </Badge>
            </div>
            {college.map_link && (
              <Button onClick={openMap} variant="outline" className="mb-4">
                <Map className="w-4 h-4 mr-2" />
                Open in Maps
              </Button>
            )}
          </div>

          <Separator />

          <div className="grid gap-6">
            <Card 
              className="cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => setSelectedSection({
                title: "Courses Offered",
                content: college.courses,
                icon: <GraduationCap className="w-5 h-5 mr-2" />
              })}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Courses Offered
                  </span>
                  <Maximize2 className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground line-clamp-3">{college.courses}</p>
              </CardContent>
            </Card>

            {college.facilities && (
              <Card 
                className="cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => setSelectedSection({
                  title: "Facilities",
                  content: college.facilities,
                  icon: <Building2 className="w-5 h-5 mr-2" />
                })}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Facilities
                    </span>
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-3">{college.facilities}</p>
                </CardContent>
              </Card>
            )}

            {college.placements && (
              <Card 
                className="cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => setSelectedSection({
                  title: "Placements",
                  content: college.placements,
                  icon: <TrendingUp className="w-5 h-5 mr-2" />
                })}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Placements
                    </span>
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-3">{college.placements}</p>
                </CardContent>
              </Card>
            )}

            {college.hostel_facilities && (
              <Card 
                className="cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => setSelectedSection({
                  title: "Hostel Facilities",
                  content: college.hostel_facilities,
                  icon: <Home className="w-5 h-5 mr-2" />
                })}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Home className="w-5 h-5 mr-2" />
                      Hostel Facilities
                    </span>
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-3">{college.hostel_facilities}</p>
                </CardContent>
              </Card>
            )}

            {college.sports_achievements && (
              <Card 
                className="cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => setSelectedSection({
                  title: "Sports Achievements",
                  content: college.sports_achievements,
                  icon: <Trophy className="w-5 h-5 mr-2" />
                })}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Sports Achievements
                    </span>
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-3">{college.sports_achievements}</p>
                </CardContent>
              </Card>
            )}

            {college.faculty_details && (
              <Card 
                className="cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => setSelectedSection({
                  title: "Faculty Details",
                  content: college.faculty_details,
                  icon: <Users className="w-5 h-5 mr-2" />
                })}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Faculty Details
                    </span>
                    <Maximize2 className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-3">{college.faculty_details}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {college.contact && (
                  <div className="flex items-center text-foreground">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    {college.contact}
                  </div>
                )}
                {college.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {college.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={!!selectedSection} onOpenChange={() => setSelectedSection(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-2xl">
                {selectedSection?.icon}
                {selectedSection?.title}
              </DialogTitle>
              <DialogDescription>
                Detailed information about {selectedSection?.title?.toLowerCase()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedSection?.content}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CollegeDetail;
