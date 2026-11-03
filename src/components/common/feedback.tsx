import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Alert } from '@/components/ui/alert';

type FeedbackType = 'success' | 'error';

interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

const FeedbackContext = createContext<(type: FeedbackType, text: string) => void>(() => {});

// Mostra uma mensagem de sucesso ou erro no canto da tela por 4 segundos
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<FeedbackMessage | null>(null);

  const notify = useCallback((type: FeedbackType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  return (
    <FeedbackContext.Provider value={notify}>
      {children}
      {message && (
        <div className="fixed right-4 bottom-4 z-[100] w-80">
          <Alert variant={message.type === 'success' ? 'success' : 'destructive'}>{message.text}</Alert>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFeedback() {
  return useContext(FeedbackContext);
}
