/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';

export const idUserLogged: string = '64ebb17c5926cf56383670bd';

interface ApiResponse {
    // Define the structure of your API response data here
}

const api = axios.create({
  baseURL: 'http://localhost:3333', // Substitua pela sua URL base
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET
export const fetchData = async (endpoint: string, withoutUser: boolean = false): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.get(`${endpoint}/${!withoutUser ? idUserLogged : ''}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

// POST
export const sendData = async (endpoint: string, data: any): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    throw error;
  }
};

// PUT
export const updateData = async (endpoint: string, data: any): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.put(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    throw error;
  }
};

// PATCH
export const partiallyUpdateData = async (endpoint: string, data: any): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.patch(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar parcialmente dados:', error);
    throw error;
  }
};

// DELETE
export const deleteData = async (endpoint: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.delete(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir dados:', error);
    throw error;
  }
};
