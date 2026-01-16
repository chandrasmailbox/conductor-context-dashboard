import { useState } from "react";
import { Search, Github, Folder } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import ModeToggle from "./ModeToggle";

interface RepoInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
  defaultValue?: string;
  syncMode: 'github' | 'local';
  onModeChange: (mode: 'github' | 'local') => void;
}

export default function RepoInput({ onSubmit, loading, defaultValue = "", syncMode, onModeChange }: RepoInputProps) {
  const [url, setUrl] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <Card
      className="border overflow-hidden relative card-hover"
      data-testid="repo-input-card"
    >
      <CardContent className="p-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              {syncMode === 'github' ? (
                <Github className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              ) : (
                <Folder className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Connect Project</h2>
              <p className="text-sm text-muted-foreground">
                {syncMode === 'github' 
                  ? "Enter a public GitHub repository URL to analyze progress" 
                  : "Enter a local directory path to analyze progress"}
              </p>
            </div>
          </div>
          
          <ModeToggle mode={syncMode} onModeChange={onModeChange} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              type="text"
              placeholder={syncMode === 'github' ? "https://github.com/owner/repository" : "/path/to/your/project"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-11 bg-background"
              data-testid="repo-url-input"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !url.trim()}
            className="h-11 px-8"
            data-testid="analyze-button"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
