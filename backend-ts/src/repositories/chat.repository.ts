import { supabase } from '../config/supabase';
import { ChatSession, ChatMessage, CreateSessionRequest } from '../types';
import { formatISOTimestamp } from '../utils/formatters';

export class ChatRepository {
  async createSession(sessionData: CreateSessionRequest): Promise<ChatSession> {
    const now = new Date();

    let clientName: string | undefined;
    if (sessionData.client_id) {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name')
        .eq('id', sessionData.client_id)
        .single();

      clientName = clientData?.name;
    }

    const title = sessionData.title || `Chat ${now.toLocaleDateString()}`;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: String(data.session_id),
      title,
      clientName,
      timestamp: formatISOTimestamp(new Date(data.created_at)),
      messageCount: 0,
      isPinned: false,
      summary: '',
      messages: [],
      tags: [],
    };
  }

  async findAllSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('session_id, client_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const sessionsWithCounts = await Promise.all(
      (data || []).map(async (row) => {
        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', row.session_id);

        // Optionally resolve client name if client_id is present
        let clientName: string | undefined;
        if (row.client_id) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('name')
            .eq('id', row.client_id)
            .single();
          clientName = clientData?.name;
        }

        return {
          id: String(row.session_id),
          title: `Chat ${new Date(row.created_at).toLocaleDateString('en-IN')}`,
          clientName,
          timestamp: formatISOTimestamp(new Date(row.created_at)),
          messageCount: count || 0,
          isPinned: !!(row as Record<string, unknown>).is_pinned,
          summary: (row as Record<string, unknown>).summary ? String((row as Record<string, unknown>).summary) : '',
          tags: Array.isArray((row as Record<string, unknown>).tags)
            ? ((row as Record<string, unknown>).tags as string[])
            : [],
        };
      })
    );

    return sessionsWithCounts;
  }

  async findSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const numericSessionId = Number(sessionId);

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', numericSessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      id: String(row.message_id),
      content: row.content,
      sender: (row.sender ?? row.role) === 'assistant' ? 'ai' : (row.sender ?? row.role),
      timestamp: formatISOTimestamp(new Date(row.created_at)),
    }));
  }

  async saveMessage(
    sessionId: string,
    content: string,
    sender: 'user' | 'ai'
  ): Promise<ChatMessage> {
    const numericSessionId = Number(sessionId);
    const now = new Date();

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: numericSessionId,
        content,
        sender: sender === 'ai' ? 'ai' : sender,
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: String(data.message_id),
      content: data.content,
      sender: (data.sender ?? data.role) === 'assistant' ? 'ai' : (data.sender ?? data.role),
      timestamp: formatISOTimestamp(new Date(data.created_at)),
    };
  }

  async sessionExists(sessionId: string): Promise<boolean> {
    const numericSessionId = Number(sessionId);
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('session_id')
      .eq('session_id', numericSessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  }
}
