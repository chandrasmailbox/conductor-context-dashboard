import { RefreshCw, Sun, Moon, GitBranch } from "lucide-react";
import { Button } from "./ui/Button";

interface HeaderProps {
  onSync: () => void;
  loading: boolean;
  hasData: boolean;
  theme: string;
  onToggleTheme: () => void;
}

export default function Header({ onSync, loading, hasData, theme, onToggleTheme }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
      data-testid="header"
    >
      <div className="container mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Conductor <span className="text-primary">Progress</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Development Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasData && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSync}
                disabled={loading}
                className="gap-2"
                data-testid="sync-button"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  strokeWidth={1.5}
                />
                <span className="hidden sm:inline">Sync</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={onToggleTheme}
              className="w-9 h-9"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={1.5} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
