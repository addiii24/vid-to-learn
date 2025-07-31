import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Youtube, FileText, Image, Loader2, Play, Download } from "lucide-react";

const VideoCreator = () => {
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const processContent = async (contentType: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create videos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('process-video-content', {
        body: {
          content_type: contentType,
          content: content,
          title: title || `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Video`
        }
      });

      if (error) {
        throw error;
      }

      setResult(data);
      toast({
        title: "Success!",
        description: "Your educational video has been generated successfully!",
      });

    } catch (error: any) {
      console.error('Error processing content:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }
    processContent('youtube', youtubeUrl);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) {
      toast({
        title: "Invalid Input", 
        description: "Please enter some text content",
        variant: "destructive",
      });
      return;
    }
    processContent('text', textContent);
  };

  const downloadAudio = () => {
    if (result?.audio_url) {
      const link = document.createElement('a');
      link.href = result.audio_url;
      link.download = 'generated-audio.mp3';
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">AI</span>
            </div>
            Create Your Educational Video
          </CardTitle>
          <CardDescription>
            Transform any content into an animated educational video with AI-generated narration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                YouTube
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="space-y-4">
              <form onSubmit={handleYouTubeSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Video Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Create Video from YouTube"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Video Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Enter your text content, topic, or learning material..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    disabled={loading}
                    rows={6}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Create Video from Text"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Image processing coming soon!</p>
                <p className="text-sm">Upload images and extract educational content with OCR</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Generated Video Content
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Completed</Badge>
              <Badge variant="outline">AI Generated</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.thumbnail_url && (
              <div>
                <h4 className="font-semibold mb-2">Thumbnail</h4>
                <img 
                  src={result.thumbnail_url} 
                  alt="Video thumbnail"
                  className="max-w-sm rounded-lg border"
                />
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Generated Script</h4>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{result.generated_script}</pre>
              </div>
            </div>

            {result.audio_url && (
              <div>
                <h4 className="font-semibold mb-2">Generated Audio</h4>
                <div className="flex items-center gap-4">
                  <audio controls className="flex-1">
                    <source src={result.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <Button onClick={downloadAudio} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Script generated with AI</p>
              <p>✓ Voice-over created with ElevenLabs</p>
              <p>✓ Ready for animation and video production</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoCreator;