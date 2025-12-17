import { supabase } from './supabaseClient';
import { AuditResult } from '../types';

export const AuditService = {
  async analyzeProfile(linkedinUrl: string): Promise<AuditResult> {
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;

    if (!token) throw new Error("Not authenticated");

    const { data, error } = await supabase.functions.invoke('analyze-profile', {
      body: { linkedinUrl },
    });

    if (error) {
      console.error("Audit Service Error:", error);
      throw error;
    }

    return data as AuditResult;
  },

  async analyzeProfilePDF(file: File): Promise<AuditResult> {
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;

    if (!token) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await supabase.functions.invoke('analyze-profile', {
      body: formData,
    });

    if (error) {
      console.error("Audit Service HTTP Error:", error);
      throw error;
    }

    if (data && data.error) {
        console.error("Audit Service Application Error:", data.error);
        throw new Error(`Profile Auditor Error: ${data.error}`);
    }

    return data as AuditResult;
  }
};
