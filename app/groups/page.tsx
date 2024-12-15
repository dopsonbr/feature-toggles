'use client';

import { useState } from 'react';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Form';
import { Table, TableRow, TableCell, TableActions } from '../components/Table';
import { api } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Group {
  id: string;
  name: string;
  description: string | null;
  owner: string;
  createTs: string;
}

interface GroupFormData {
  id?: string;
  name: string;
  description: string;
  owner: string;
}

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    owner: '',
  });

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroups,
  });

  const createMutation = useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      owner: '',
    });
    setEditingGroup(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      updateMutation.mutate({ ...formData, id: editingGroup.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      owner: group.owner,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Groups</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Group</Button>
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
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingGroup ? 'Update' : 'Create'} Group
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <Table
          headers={['Name', 'Owner', 'Description', 'Actions']}
        >
          {groups.map((group: Group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.owner}</TableCell>
              <TableCell>{group.description}</TableCell>
              <TableActions>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(group)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(group.id)}
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
