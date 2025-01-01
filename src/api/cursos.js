import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/cursos',
  list: '/getCursos',
  insert: '/addCurso',
  update: '/updateCurso',
  delete: '/deleteCurso',
  deletes: '/deleteCursos'
};

// TRAE TODOS LOS CURSOS

export function useGetCursos() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      cursos: data?.cursos,
      cursosLoading: isLoading,
      cursosError: error,
      cursosValidating: isValidating,
      cursosEmpty: !isLoading && !data?.cursos?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR CURSO

export async function insertCurso(newCurso) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newCurso, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR CURSO

export async function updateCurso(cursoID, updatedCurso) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update + `/` + cursoID, updatedCurso, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR CURSO

export async function deleteCurso(deleteCurso) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + deleteCurso, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR CONJUNTO DE CURSOS

export async function deleteManyCursos(deleteCursos) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.deletes, {
      data: deleteCursos, // Envuelve el array en un objeto
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
