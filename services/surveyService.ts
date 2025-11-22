import { supabase } from '../supabaseClient';
import { Answer, AnswerOption, Session } from '../types';

// --- Session Management ---

export const createSession = async (name: string): Promise<Session | null> => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ name, status: 'active' }])
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return null;
  }
  return data;
};

export const getSession = async (id: string): Promise<Session | null> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

// --- Answer Management ---

export const saveAnswer = async (sessionId: string, questionId: number, option: AnswerOption) => {
  const { error } = await supabase
    .from('answers')
    .insert([
      { 
        session_id: sessionId, 
        question_id: questionId, 
        option_value: option 
      }
    ]);

  if (error) {
    console.error('Error saving answer:', error);
  }
};

export const getAnswersForSession = async (sessionId: string): Promise<Answer[]> => {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('session_id', sessionId);

  if (error || !data) {
    console.error('Error fetching answers:', error);
    return [];
  }

  // Map DB columns to our TS interface
  return data.map((row: any) => ({
    id: row.id,
    questionId: row.question_id,
    option: row.option_value as AnswerOption,
    sessionId: row.session_id
  }));
};

// --- Realtime Subscription ---

export const subscribeToSessionAnswers = (sessionId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:answers:session_id=eq.${sessionId}`)
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'answers', 
        filter: `session_id=eq.${sessionId}` 
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};