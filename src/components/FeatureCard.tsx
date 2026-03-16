import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  buttonLabel?: string;
}

const FeatureCard = ({ icon, title, description, onClick, buttonLabel }: FeatureCardProps) => {
  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 h-full bg-card text-card-foreground outline-none"
      style={{ cursor: "pointer" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-foreground mb-2">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors cursor-pointer"
          onClick={e => { e.stopPropagation(); onClick(); }}
        >
          {buttonLabel || "Learn More"}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard