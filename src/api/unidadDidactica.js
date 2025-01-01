import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/unidades',
  list: '/getUnidades',
  insert: '/addUnidad',
  update: '/updateUnidad',
  delete: '/deleteUnidad',
  deletes: '/deleteSelectedUnidades'
};

// TRAE TODOS LAS UNIDADES

export function useGetUnidadDidactica() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      unidadesDidacticas: data?.unidades,
      unidadesDidacticasLoading: isLoading,
      unidadesDidacticasError: error,
      unidadesDidacticasValidating: isValidating,
      unidadesDidacticasEmpty: !isLoading && !data?.unidades?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR UNIDAD

export async function insertUnidadDidactica(newUnidad) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newUnidad, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR UNIDAD

export async function updateUnidadDidactica(unidadID, updatedUnidad) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update + `/` + unidadID, updatedUnidad, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR UNIDAD

export async function deleteUnidadDidactica(deleteUnidad) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + deleteUnidad, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR CONJUNTO DE UNIDADES

export async function deleteManyUnidadDidacticas(deleteUnidads) {
  console.log(deleteUnidads)
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.deletes, {
      data: deleteUnidads, // Envuelve el array en un objeto
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
