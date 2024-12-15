import { useState } from 'react';
import { Button } from './Button';
import { Table, TableRow, TableCell, TableActions } from './Table';
import { api } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Toggle {
  featureId: string;
  groupId: string;
  productId: string;
  environmentId: string;
  feature: {
    name: string;
  };
  group: {
    name: string;
  };
  product: {
    name: string;
  };
  environment: {
    name: string;
  };
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  owner: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  owner: string;
}

interface Environment {
  id: string;
  name: string;
  description: string | null;
}

interface ToggleFormData {
  groupId: string;
  productId: string;
  environmentId: string;
}

interface FeatureTogglesProps {
  featureId: string;
}

export function FeatureToggles({ featureId }: FeatureTogglesProps) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ToggleFormData>({
    groupId: '',
    productId: '',
    environmentId: '',
  });

  const { data: toggles = [], isLoading: isLoadingToggles } = useQuery({
    queryKey: ['toggles', featureId],
    queryFn: () => api.getToggles({ featureId }),
  });

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroups,
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  const { data: environments = [], isLoading: isLoadingEnvironments } = useQuery({
    queryKey: ['environments'],
    queryFn: api.getEnvironments,
  });

  const createMutation = useMutation({
    mutationFn: (data: ToggleFormData) =>
      api.createToggle({ ...data, featureId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toggles', featureId] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (toggle: Toggle) =>
      api.deleteToggle({
        featureId: toggle.featureId,
        groupId: toggle.groupId,
        productId: toggle.productId,
        environmentId: toggle.environmentId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toggles', featureId] });
    },
  });

  const resetForm = () => {
    setFormData({
      groupId: '',
      productId: '',
      environmentId: '',
    });
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (toggle: Toggle) => {
    if (confirm('Are you sure you want to remove this toggle?')) {
      deleteMutation.mutate(toggle);
    }
  };

  if (isLoadingToggles || isLoadingGroups || isLoadingProducts || isLoadingEnvironments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Feature Toggles</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Toggle</Button>
      </div>

      {isFormOpen && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group
              </label>
              <select
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                required
              >
                <option value="">Select a group</option>
                {groups.map((group: Group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                required
              >
                <option value="">Select a product</option>
                {products.map((product: Product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                value={formData.environmentId}
                onChange={(e) => setFormData({ ...formData, environmentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                required
              >
                <option value="">Select an environment</option>
                {environments.map((environment: Environment) => (
                  <option key={environment.id} value={environment.id}>
                    {environment.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Add Toggle</Button>
            </div>
          </form>
        </div>
      )}

      <Table
        headers={['Group', 'Product', 'Environment', 'Actions']}
      >
        {toggles.map((toggle: Toggle) => (
          <TableRow key={`${toggle.groupId}-${toggle.productId}-${toggle.environmentId}`}>
            <TableCell>{toggle.group.name}</TableCell>
            <TableCell>{toggle.product.name}</TableCell>
            <TableCell>{toggle.environment.name}</TableCell>
            <TableActions>
              <Button
                variant="danger"
                onClick={() => handleDelete(toggle)}
              >
                Remove
              </Button>
            </TableActions>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
