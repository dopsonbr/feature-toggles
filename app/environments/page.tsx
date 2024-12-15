'use client';

import { useState } from 'react';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Form';
import { Table, TableRow, TableCell, TableActions } from '../components/Table';
import { api } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Environment {
  id: string;
  name: string;
  description: string | null;
  createTs: string;
}

interface EnvironmentFormData {
  id?: string;
  name: string;
  description: string;
}

export default function EnvironmentsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);
  const [formData, setFormData] = useState<EnvironmentFormData>({
    name: '',
    description: '',
  });

  const { data: environments = [], isLoading } = useQuery({
    queryKey: ['environments'],
    queryFn: api.getEnvironments,
  });

  const createMutation = useMutation({
    mutationFn: api.createEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingEnvironment(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEnvironment) {
      updateMutation.mutate({ ...formData, id: editingEnvironment.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (environment: Environment) => {
    setEditingEnvironment(environment);
    setFormData({
      name: environment.name,
      description: environment.description || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this environment?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Environments</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Environment</Button>
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
            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEnvironment ? 'Update' : 'Create'} Environment
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <Table
          headers={['Name', 'Description', 'Actions']}
        >
          {environments.map((environment: Environment) => (
            <TableRow key={environment.id}>
              <TableCell>{environment.name}</TableCell>
              <TableCell>{environment.description}</TableCell>
              <TableActions>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(environment)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(environment.id)}
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
