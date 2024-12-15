'use client';

import { useState } from 'react';
import { Button } from './components/Button';
import { Input, TextArea, Toggle } from './components/Form';
import { Table, TableRow, TableCell, TableActions } from './components/Table';
import { api } from './utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Feature {
  id: string;
  type: string;
  owner: string;
  name: string;
  description: string | null;
  enabled: boolean;
  createTs: string;
}

interface FeatureFormData {
  id?: string;
  type: string;
  owner: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function FeaturesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState<FeatureFormData>({
    type: '',
    owner: '',
    name: '',
    description: '',
    enabled: false,
  });

  const { data: features = [], isLoading } = useQuery({
    queryKey: ['features'],
    queryFn: api.getFeatures,
  });

  const createMutation = useMutation({
    mutationFn: api.createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });

  const resetForm = () => {
    setFormData({
      type: '',
      owner: '',
      name: '',
      description: '',
      enabled: false,
    });
    setEditingFeature(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeature) {
      updateMutation.mutate({ ...formData, id: editingFeature.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      type: feature.type,
      owner: feature.owner,
      name: feature.name,
      description: feature.description || '',
      enabled: feature.enabled,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Features</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Feature</Button>
      </div>

      {isFormOpen && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
            <Input
              label="Owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              required
            />
            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Toggle
              label="Enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingFeature ? 'Update' : 'Create'} Feature
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <Table
          headers={['Name', 'Type', 'Owner', 'Description', 'Status', 'Actions']}
        >
          {features.map((feature: Feature) => (
            <TableRow key={feature.id}>
              <TableCell>{feature.name}</TableCell>
              <TableCell>{feature.type}</TableCell>
              <TableCell>{feature.owner}</TableCell>
              <TableCell>{feature.description}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    feature.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {feature.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </TableCell>
              <TableActions>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(feature)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(feature.id)}
                >
                  Delete
                </Button>
              </TableActions>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
}
