import { supabase } from '../config/supabase';
import { Task, TasksQueryParams, CreateTaskRequest } from '../types';
import { formatISODate, formatISOTimestamp } from '../utils/formatters';
import { v4 as uuidv4 } from 'uuid';

export class TaskRepository {
  async findAll(params: TasksQueryParams): Promise<{ tasks: Task[]; total: number }> {
    let query = supabase.from('tasks').select('*', { count: 'exact' });

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.priority) {
      query = query.eq('priority', params.priority);
    }

    if (params.client_id) {
      query = query.eq('client_id', params.client_id);
    }

    const limit = params.limit || 50;
    const offset = params.offset || 0;

    query = query.range(offset, offset + limit - 1).order('due_date', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const tasks = (data || []).map((row) => this.mapToTask(row));

    return {
      tasks,
      total: count || 0,
    };
  }

  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return this.mapToTask(data);
  }

  async create(taskData: CreateTaskRequest): Promise<Task> {
    const id = uuidv4();
    const now = new Date();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id,
        client_id: taskData.client_id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: 'pending',
        due_date: taskData.due_date,
        assignee: taskData.assignee || 'Unassigned',
        tags: taskData.tags || [],
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .select('*, clients(name)')
      .single();

    if (error) {
      throw error;
    }

    return this.mapToTask(data);
  }

  async toggleStatus(id: string): Promise<{ id: string; status: Task['status']; updatedAt: string }> {
    const task = await this.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const now = new Date();

    const { error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        updated_at: now.toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return {
      id,
      status: newStatus,
      updatedAt: formatISOTimestamp(now),
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapToTask(row: Record<string, unknown>): Task {
    const clients = row.clients as Record<string, unknown> | null;

    return {
      id: row.id as string,
      title: row.title as string,
      description: row.description as string,
      priority: row.priority as Task['priority'],
      status: row.status as Task['status'],
      dueDate: formatISODate(new Date(row.due_date as string)),
      assignee: row.assignee as string,
      clientName: clients ? (clients.name as string) : undefined,
      tags: row.tags as string[],
    };
  }
}
