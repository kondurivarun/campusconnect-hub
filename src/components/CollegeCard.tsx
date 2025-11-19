import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface CollegeCardProps {
  id: string;
  name: string;
  district: string;
  courses: string;
  placements: string;
  imageUrl?: string;
}

const CollegeCard = ({ id, name, district, courses, placements, imageUrl }: CollegeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 h-full flex flex-col">
      {imageUrl && (
        <div className="h-48 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl line-clamp-2">{name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            <MapPin className="w-3 h-3 mr-1" />
            {district}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{courses}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{placements}</p>
        <Button asChild className="w-full">
          <Link to={`/college/${id}`}>
            View Details
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
