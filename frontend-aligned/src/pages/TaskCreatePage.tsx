import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Card } from '../components/ui';
import { AISuggestionBanner, TaskForm, AIContextPanel } from '../components/create-task';
import { taskService } from '../services/taskService';
import { useToast } from '../components/ui/Toast';
import type { TaskPriority } from '../types/task';

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  clientName: string;
  tags: string;
}

export const TaskCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    clientName: '',
    tags: '',
  });

  const aiSuggestion = {
    title: 'Review portfolio rebalancing for Sarah Johnson',
    description: 'Equity allocation is 5% above target. Need to rebalance within 7 days to maintain compliance with risk tolerance.',
    priority: 'Urgent',
    dueDate: 'Tomorrow',
  };

  const handleApplySuggestion = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    setFormData({
      title: aiSuggestion.title,
      description: aiSuggestion.description,
      priority: 'urgent',
      dueDate: tomorrow.toISOString().split('T')[0],
      clientName: 'Sarah Johnson',
      tags: 'Portfolio, Compliance',
    });
    setShowSuggestion(false);
  };

  const handleFieldChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      showToast('Task title is required.', 'warning');
      return;
    }
    if (!formData.dueDate) {
      showToast('Due date is required.', 'warning');
      return;
    }

    const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    const priority: TaskPriority = validPriorities.includes(formData.priority as TaskPriority)
      ? (formData.priority as TaskPriority)
      : 'medium';

    const tags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    setIsSubmitting(true);
    try {
      await taskService.create({
        title: formData.title.trim(),
        description: formData.description.trim() || formData.title.trim(),
        priority,
        due_date: formData.dueDate,
        assignee: 'Unassigned',
        tags,
      });
      showToast('Task created successfully.', 'success');
      navigate('/tasks');
    } catch {
      showToast('Failed to create task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <PageWrapper title="Create Task" subtitle="Add a new task with AI assistance">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showSuggestion && (
            <AISuggestionBanner
              suggestion={aiSuggestion}
              onApply={handleApplySuggestion}
              onDismiss={() => setShowSuggestion(false)}
            />
          )}

          <Card padding="lg">
            <TaskForm
              formData={formData}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </Card>
        </div>

        <div>
          <AIContextPanel />
        </div>
      </div>
    </PageWrapper>
  );
};
