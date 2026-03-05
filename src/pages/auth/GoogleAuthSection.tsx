import type { RefObject } from 'react';

type GoogleAuthSectionProps = {
  clientId?: string;
  isGoogleLoading: boolean;
  buttonContainerRef: RefObject<HTMLDivElement>;
};

export function GoogleAuthSection({
  clientId,
  isGoogleLoading,
  buttonContainerRef,
}: GoogleAuthSectionProps) {
  if (!clientId) {
    return (
      <p className="mt-6 text-xs text-muted-foreground text-center">
        Login com Google indisponivel. Configure `VITE_GOOGLE_CLIENT_ID`.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
      </div>
      <div className={isGoogleLoading ? 'pointer-events-none opacity-70' : ''}>
        <div ref={buttonContainerRef} className="flex justify-center" />
      </div>
    </div>
  );
}
