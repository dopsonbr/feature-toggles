/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = '/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

export const api = {
  // Features
  getFeatures: () => 
    fetch(`${BASE_URL}/features`).then(handleResponse),
  
  createFeature: (data: any) =>
    fetch(`${BASE_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  updateFeature: (data: any) =>
    fetch(`${BASE_URL}/features`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  deleteFeature: (id: string) =>
    fetch(`${BASE_URL}/features?id=${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Products
  getProducts: () =>
    fetch(`${BASE_URL}/products`).then(handleResponse),
  
  createProduct: (data: any) =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  updateProduct: (data: any) =>
    fetch(`${BASE_URL}/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  deleteProduct: (id: string) =>
    fetch(`${BASE_URL}/products?id=${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Environments
  getEnvironments: () =>
    fetch(`${BASE_URL}/environments`).then(handleResponse),
  
  createEnvironment: (data: any) =>
    fetch(`${BASE_URL}/environments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  updateEnvironment: (data: any) =>
    fetch(`${BASE_URL}/environments`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  deleteEnvironment: (id: string) =>
    fetch(`${BASE_URL}/environments?id=${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Groups
  getGroups: () =>
    fetch(`${BASE_URL}/groups`).then(handleResponse),
  
  createGroup: (data: any) =>
    fetch(`${BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  updateGroup: (data: any) =>
    fetch(`${BASE_URL}/groups`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  deleteGroup: (id: string) =>
    fetch(`${BASE_URL}/groups?id=${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Feature Toggles
  getToggles: (params?: { featureId?: string; groupId?: string; productId?: string; environmentId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.featureId) searchParams.append('featureId', params.featureId);
    if (params?.groupId) searchParams.append('groupId', params.groupId);
    if (params?.productId) searchParams.append('productId', params.productId);
    if (params?.environmentId) searchParams.append('environmentId', params.environmentId);
    
    return fetch(`${BASE_URL}/toggles?${searchParams}`).then(handleResponse);
  },
  
  createToggle: (data: { featureId: string; groupId: string; productId: string; environmentId: string }) =>
    fetch(`${BASE_URL}/toggles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateToggle: (oldData: { featureId: string; groupId: string; productId: string; environmentId: string }, 
                newData: { featureId: string; groupId: string; productId: string; environmentId: string }) =>
    fetch(`${BASE_URL}/toggles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldData, newData }),
    }).then(handleResponse),
  
  deleteToggle: (params: { featureId: string; groupId: string; productId: string; environmentId: string }) => {
    const searchParams = new URLSearchParams(params as Record<string, string>);
    return fetch(`${BASE_URL}/toggles?${searchParams}`, {
      method: 'DELETE',
    }).then(handleResponse);
  },
};
