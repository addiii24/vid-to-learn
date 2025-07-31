import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Cpu, Download } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Input Your Content",
      description: "Paste a YouTube link, upload an image with text, or type your educational content directly into our platform.",
      details: ["YouTube video analysis", "OCR text extraction", "Direct text input"]
    },
    {
      step: "02", 
      icon: Cpu,
      title: "AI Processing",
      description: "Our advanced AI analyzes your content, generates an educational script, and creates voice-over narration.",
      details: ["Content analysis", "Script generation", "Voice synthesis"]
    },
    {
      step: "03",
      icon: Download,
      title: "Get Your Video",
      description: "Download your professionally animated educational video with captions, effects, and high-quality audio.",
      details: ["Animated visuals", "Professional captions", "HD video export"]
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            How{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              EduVidAI
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your educational content into professional videos in just three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-6xl font-bold text-primary/20">
                    {step.step}
                  </div>
                  <div className="p-4 bg-gradient-primary rounded-2xl">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2 mb-8">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>

                {index === steps.length - 1 && (
                  <Button variant="hero" size="lg" className="group">
                    Start Creating Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>

              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Card className="p-8 bg-gradient-secondary border-border/50 shadow-card relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-hero opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-full h-64 bg-muted/20 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      <step.icon className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="h-4 bg-muted/30 rounded w-3/4" />
                      <div className="h-4 bg-muted/30 rounded w-1/2" />
                      <div className="h-4 bg-muted/30 rounded w-2/3" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
          <div className="space-y-32">
            <ArrowRight className="h-8 w-8 text-primary/30 rotate-90" />
            <ArrowRight className="h-8 w-8 text-primary/30 rotate-90" />
          </div>
        </div>
      </div>
    </section>
  );
};