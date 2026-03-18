import { ArrowLeft } from 'lucide-react';

interface NavigationBarProps {
  onLogoClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

export default function NavigationBar({
  onLogoClick,
  onBackClick,
  showBackButton = false,
  rightContent
}: NavigationBarProps) {
  return (
    <nav style={{ background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && onBackClick && (
              <button
                onClick={onBackClick}
                style={{
                  padding: 8,
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" style={{ color: 'white' }} />
              </button>
            )}
            <button
              onClick={onLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy copy.png"
                alt="CeenAiX Logo"
                className="h-32 w-auto"
              />
            </button>
          </div>
          {rightContent && (
            <div className="flex items-center gap-3">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
