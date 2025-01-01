import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/profesor',
  list: '/getProfesores',
  insert: '/addProfesor',
  update: '/updateProfesor',
  delete: '/deleteProfesor',
  deletes: '/deleteSelectedProfesores'
};

// TRAE TODOS LOS PROFESORES

export function useGetProfesor() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      profesores: data?.profesores,
      profesoresLoading: isLoading,
      profesoresError: error,
      profesoresValidating: isValidating,
      profesoressEmpty: !isLoading && !data?.profesores?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR PROFESORE

export async function insertProfesor(newProfesor) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newProfesor, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR PROFESOR

export async function updateProfesor(profesorID, updatedProfesor) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update + `/` + profesorID, updatedProfesor, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR PROFESOR

export async function deleteProfesor(deleteProfesor) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + deleteProfesor, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR CONJUNTO DE PROFESORES

export async function deleteManyProfesors(deleteProfesors) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.deletes, {
      data: deleteProfesors, // Envuelve el array en un objeto
      headers: {
        Authorization: serviceToken, // Usa 'Authorization' (estándar)
        'Content-Type': 'application/json', // Asegura que el tipo de contenido sea JSON
      },
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.error(error);
  }
}