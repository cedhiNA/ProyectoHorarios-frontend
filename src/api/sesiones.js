import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/sesiones',
  list: '/getSesiones',
  insert: '/addSesion',
  update: '/updateSesion',
  delete: '/deleteSesion',
  deletes: '/deleteSelectedSesiones',
};

// TRAE TODOS LAS SESIONES

export function useGetSesiones() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      scheduleClass: data?.sesiones,
      scheduleClassLoading: isLoading,
      scheduleClassError: error,
      scheduleClassValidating: isValidating,
      scheduleClassEmpty: !isLoading && !data?.sesiones?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR SESION

export async function insertSesiones(newSesiones) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newSesiones, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR SESION

export async function updateSesiones(sesionesID, updatedSesiones) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update + `/` + sesionesID, updatedSesiones, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR SESION

export async function deleteSesiones(deleteSesiones) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + deleteSesiones, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR CONJUNTO DE SESIONES

export async function deleteManySesiones(deleteSesiones) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.deletes, {
      data: deleteSesiones, // Envuelve el array en un objeto
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

