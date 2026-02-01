import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';

export function usePostFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (postId: string, feedback: 'positive' | 'negative'): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('update-post-feedback', {
        body: { postId, feedback }
      });

      if (error) throw error;

      if (feedback === 'positive') {
        toast.success('¡Genial! He guardado este post en mi memoria para aprender de tu estilo.');
      } else {
        toast.info('Entendido. Evitaré este tipo de contenido en el futuro.');
      }
      
      return true;
    } catch (error) {
      console.error('Feedback Error:', error);
      toast.error('No se pudo guardar el feedback.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitFeedback, isSubmitting };
}
