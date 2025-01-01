import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/aulas',
  list: '/getAulas',
  insert: '/addAula',
  update: '/updateAula',
  delete: '/deleteAula',
  deletes: '/deleteSelectedAulas',
};

// TRAE TODOS LAS AULAS

export function useGetAulas() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      aulas: data?.aulas,
      aulasLoading: isLoading,
      aulasError: error,
      aulasValidating: isValidating,
      aulasEmpty: !isLoading && !data?.aulas?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR AULA

export async function insertAula(newAula) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newAula, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR AULA

export async function updateAula(aulaID, updatedAula) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update + `/` + aulaID, updatedAula, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR AULA

export async function deleteAula(deleteAula) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + deleteAula, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR CONJUNTO DE AULAS

export async function deleteManyAulas(deleteAulas) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.deletes, {
      data: deleteAulas, // Envuelve el array en un objeto
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
