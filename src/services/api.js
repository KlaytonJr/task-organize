import axios from 'axios';

export const idUserLogged = '64ebb17c5926cf56383670bd';

const api = axios.create({
  baseURL: 'http://localhost:3333', // Substitua pela sua URL base
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET
export const fetchData = async (endpoint, withoutUser = false) => {
  try {
    const response = await api.get(`${endpoint}/${!withoutUser ? idUserLogged : ''}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

// POST
export const sendData = async (endpoint, data) => {
  try {
    const response = await api.post(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    throw error;
  }
};

// PUT
export const updateData = async (endpoint, data) => {
  try {
    const response = await api.put(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    throw error;
  }
};

// PATCH
export const partiallyUpdateData = async (endpoint, data) => {
  try {
    const response = await api.patch(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar parcialmente dados:', error);
    throw error;
  }
};

// DELETE
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir dados:', error);
    throw error;
  }
};
