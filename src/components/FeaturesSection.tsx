import { Card } from "@/components/ui/card";
import { Youtube, FileImage, Brain, Video, Mic, Type } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Youtube,
      title: "YouTube to Video",
      description: "Paste any YouTube link and automatically extract key content to create educational animations.",
      color: "text-red-400"
    },
    {
      icon: FileImage,
      title: "Image Processing",
      description: "Upload images with text and our OCR technology will extract and transform content into videos.",
      color: "text-blue-400"
    },
    {
      icon: Type,
      title: "Text to Animation",
      description: "Simply type or paste your educational content and watch it transform into engaging video lessons.",
      color: "text-green-400"
    },
    {
      icon: Brain,
      title: "AI Script Generation",
      description: "Advanced AI creates compelling educational scripts optimized for visual learning and retention.",
      color: "text-purple-400"
    },
    {
      icon: Mic,
      title: "Voice Synthesis",
      description: "High-quality AI voice-over brings your educational content to life with natural speech patterns.",
      color: "text-yellow-400"
    },
    {
      icon: Video,
      title: "Animated Videos",
      description: "Professional animations with captions and effects make complex topics easy to understand.",
      color: "text-pink-400"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Powerful Features for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Modern Learning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform any educational content into engaging video lessons with cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 group hover:shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-primary rounded-xl">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Videos Created</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-muted-foreground">Accuracy Rate</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5K+</div>
            <div className="text-muted-foreground">Happy Users</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">AI Processing</div>
          </div>
        </div>
      </div>
    </section>
  );
};