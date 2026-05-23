import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { GOOGLE_BUTTON_OPTIONS, GOOGLE_GSI_SCRIPT } from './constants';
import './types';

function loadGoogleScript(onLoad: () => void): () => void {
  if (window.google) {
    onLoad();
    return () => {};
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_GSI_SCRIPT}"]`);
  if (existingScript) {
    existingScript.addEventListener('load', onLoad);
    return () => existingScript.removeEventListener('load', onLoad);
  }

  const script = document.createElement('script');
  script.src = GOOGLE_GSI_SCRIPT;
  script.async = true;
  script.defer = true;
  script.addEventListener('load', onLoad);
  document.head.appendChild(script);

  return () => script.removeEventListener('load', onLoad);
}

type UseGoogleGsiButtonParams = {
  clientId?: string;
  containerRef?: RefObject<HTMLDivElement>;
  onCredential: (idToken: string) => void;
  onMissingCredential: () => void;
  renderButton?: boolean;
};

export function useGoogleGsiButton({
  clientId,
  containerRef,
  onCredential,
  onMissingCredential,
  renderButton = true,
}: UseGoogleGsiButtonParams) {
  const [isReady, setIsReady] = useState(false);
  const credentialHandlerRef = useRef<(credential: string | undefined) => void>(() => {});

  credentialHandlerRef.current = (credential) => {
    if (!credential) {
      onMissingCredential();
      return;
    }
    onCredential(credential);
  };

  useEffect(() => {
    const container = containerRef?.current;
    if (!clientId || (renderButton && !container)) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => credentialHandlerRef.current(credential),
      });

      if (renderButton && container) {
        container.innerHTML = '';
        window.google.accounts.id.renderButton(container, GOOGLE_BUTTON_OPTIONS);
      }

      setIsReady(true);
    };

    return loadGoogleScript(initializeGoogle);
  }, [clientId, containerRef, renderButton]);

  const prompt = useCallback(() => {
    window.google?.accounts.id.prompt();
  }, []);

  return { isReady, prompt };
}
