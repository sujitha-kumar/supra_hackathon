import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Card } from '../components/ui';
import { AISuggestionBanner, TaskForm, AIContextPanel } from '../components/create-task';

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
  const [showSuggestion, setShowSuggestion] = useState(true);
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

  const handleSubmit = () => {
    console.log('Creating task:', formData);
    navigate('/tasks');
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <PageWrapper
      title="Create Task"
      subtitle="Add a new task with AI assistance"
    >
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
