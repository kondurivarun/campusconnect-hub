import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

const AddEditCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    courses: "",
    facilities: "",
    placements: "",
    hostel_facilities: "",
    sports_achievements: "",
    faculty_details: "",
    contact: "",
    website: "",
    map_link: "",
    image_url: "",
  });

  const { data: college } = useQuery({
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
    enabled: isEditing,
  });

  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name || "",
        district: college.district || "",
        courses: college.courses || "",
        facilities: college.facilities || "",
        placements: college.placements || "",
        hostel_facilities: college.hostel_facilities || "",
        sports_achievements: college.sports_achievements || "",
        faculty_details: college.faculty_details || "",
        contact: college.contact || "",
        website: college.website || "",
        map_link: college.map_link || "",
        image_url: college.image_url || "",
      });
    }
  }, [college]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        const { error } = await supabase
          .from("colleges")
          .update(formData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("colleges").insert([formData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges"] });
      toast({
        title: isEditing ? "College updated" : "College added",
        description: `The college has been successfully ${isEditing ? "updated" : "added"}.`,
      });
      navigate("/admin");
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit College" : "Add New College"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update college information" : "Enter details for the new college"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">College Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courses">Courses *</Label>
                <Textarea
                  id="courses"
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilities">Facilities</Label>
                <Textarea
                  id="facilities"
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placements">Placements</Label>
                <Textarea
                  id="placements"
                  name="placements"
                  value={formData.placements}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostel_facilities">Hostel Facilities</Label>
                <Textarea
                  id="hostel_facilities"
                  name="hostel_facilities"
                  value={formData.hostel_facilities}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sports_achievements">Sports Achievements</Label>
                <Textarea
                  id="sports_achievements"
                  name="sports_achievements"
                  value={formData.sports_achievements}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty_details">Faculty Details</Label>
                <Textarea
                  id="faculty_details"
                  name="faculty_details"
                  value={formData.faculty_details}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="map_link">Map Link</Label>
                <Input
                  id="map_link"
                  name="map_link"
                  type="url"
                  value={formData.map_link}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Update College"
                  ) : (
                    "Add College"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
                  disabled={saveMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddEditCollege;
