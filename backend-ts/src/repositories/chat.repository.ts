import { supabase } from '../config/supabase';
import { ChatSession, ChatMessage, CreateSessionRequest } from '../types';
import { formatISOTimestamp } from '../utils/formatters';
import { v4 as uuidv4 } from 'uuid';

export class ChatRepository {
  async createSession(sessionData: CreateSessionRequest): Promise<ChatSession> {
    const id = uuidv4();
    const now = new Date();

    let clientName: string | undefined;
    if (sessionData.client_id) {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name')
        .eq('client_id', sessionData.client_id)
        .single();

      clientName = clientData?.name;
    }

    const title = sessionData.title || `Chat ${now.toLocaleDateString()}`;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        id,
        client_id: sessionData.client_id,
        title,
        created_at: now.toISOString(),
        is_pinned: false,
        summary: '',
        tags: [],
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      clientName,
      timestamp: formatISOTimestamp(new Date(data.created_at)),
      messageCount: 0,
      isPinned: data.is_pinned,
      summary: data.summary,
      messages: [],
      tags: data.tags,
    };
  }

  async findAllSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*, clients(name)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const sessionsWithCounts = await Promise.all(
      (data || []).map(async (row) => {
        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', row.id);

        const clients = row.clients as Record<string, unknown> | null;

        return {
          id: row.id,
          title: row.title,
          clientName: clients ? (clients.name as string) : undefined,
          timestamp: formatISOTimestamp(new Date(row.created_at)),
          messageCount: count || 0,
          isPinned: row.is_pinned,
          summary: row.summary,
          tags: row.tags,
        };
      })
    );

    return sessionsWithCounts;
  }

  async findSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      content: row.content,
      sender: row.sender,
      timestamp: formatISOTimestamp(new Date(row.created_at)),
    }));
  }

  async saveMessage(
    sessionId: string,
    content: string,
    sender: 'user' | 'ai'
  ): Promise<ChatMessage> {
    const id = uuidv4();
    const now = new Date();

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        id,
        session_id: sessionId,
        content,
        sender,
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      content: data.content,
      sender: data.sender,
      timestamp: formatISOTimestamp(new Date(data.created_at)),
    };
  }

  async sessionExists(sessionId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  }
}
