const API_URL = import.meta.env.VITE_API_URL || 'https://hackathon-backend-xgn6.onrender.com';

async function handleResponse(response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'API error');
  }
  return response.json();
}

export async function searchClients(q) {
  const response = await fetch(`${API_URL}/api/clients/search?q=${encodeURIComponent(q)}`);
  return handleResponse(response);
}

export async function getClients() {
  const response = await fetch(`${API_URL}/api/clients`);
  return handleResponse(response);
}

export async function getClient(id) {
  const response = await fetch(`${API_URL}/api/clients/${id}`);
  return handleResponse(response);
}

export async function generateBrief(clientId) {
  const response = await fetch(`${API_URL}/api/brief/${clientId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
}

export async function copilotChat(clientId, question, language = 'english') {
  const response = await fetch(`${API_URL}/api/copilot/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clientId, question, language }),
  });
  return handleResponse(response);
}
