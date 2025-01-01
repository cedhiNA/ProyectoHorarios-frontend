import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/excel',
  keygenerar: '/generarModelo',
  keygenerarfull: '/generarModeloFull',
  keyaula: '/aula',

  keyprofesor: '/profesor',
  keycurso: '/curso'
};


export async function getModeloAula() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(
      URL + endpoints.key + endpoints.keygenerar + endpoints.keyaula,
      {
        headers: { authorization: serviceToken },
        responseType: 'blob', // Importante para manejar archivos binarios
      }
    );

    if (response.status === 200) {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Establece el nombre del archivo para la descarga
      link.setAttribute('download', 'plantilla_aula.xlsx');
      document.body.appendChild(link);

      // Forzar la descarga
      link.click();

      // Eliminar el enlace para limpiar el DOM
      document.body.removeChild(link);
    } else {
      console.error('Error al generar el archivo');
    }
  } catch (error) {
    console.error(error);
  }
}


export async function getModeloFullAula() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(
      URL + endpoints.key + endpoints.keygenerarfull + endpoints.keyaula,
      {
        headers: { authorization: serviceToken },
        responseType: 'blob', // Importante para manejar archivos binarios
      }
    );

    if (response.status === 200) {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Establece el nombre del archivo para la descarga
      link.setAttribute('download', 'plantilla_full_aula.xlsx');
      document.body.appendChild(link);

      // Forzar la descarga
      link.click();

      // Eliminar el enlace para limpiar el DOM
      document.body.removeChild(link);
    } else {
      console.error('Error al generar el archivo');
    }
  } catch (error) {
    console.error(error);
  }
}


export async function getModeloProfesor() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(
      URL + endpoints.key + endpoints.keygenerar + endpoints.keyprofesor,
      {
        headers: { authorization: serviceToken },
        responseType: 'blob', // Importante para manejar archivos binarios
      }
    );

    if (response.status === 200) {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Establece el nombre del archivo para la descarga
      link.setAttribute('download', 'plantilla_profesor.xlsx');
      document.body.appendChild(link);

      // Forzar la descarga
      link.click();

      // Eliminar el enlace para limpiar el DOM
      document.body.removeChild(link);
    } else {
      console.error('Error al generar el archivo');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getModeloFullProfesor() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(
      URL + endpoints.key + endpoints.keygenerarfull + endpoints.keyprofesor,
      {
        headers: { authorization: serviceToken },
        responseType: 'blob', // Importante para manejar archivos binarios
      }
    );

    if (response.status === 200) {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Establece el nombre del archivo para la descarga
      link.setAttribute('download', 'plantilla_full_profesor.xlsx');
      document.body.appendChild(link);

      // Forzar la descarga
      link.click();

      // Eliminar el enlace para limpiar el DOM
      document.body.removeChild(link);
    } else {
      console.error('Error al generar el archivo');
    }
  } catch (error) {
    console.error(error);
  }
}


export async function getModeloCurso() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(
      URL + endpoints.key + endpoints.keygenerar + endpoints.keycurso,
      {
        headers: { authorization: serviceToken },
        responseType: 'blob', // Importante para manejar archivos binarios
      }
    );

    if (response.status === 200) {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Establece el nombre del archivo para la descarga
      link.setAttribute('download', 'plantilla_curso.xlsx');
      document.body.appendChild(link);

      // Forzar la descarga
      link.click();

      // Eliminar el enlace para limpiar el DOM
      document.body.removeChild(link);
    } else {
      console.error('Error al generar el archivo');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getModeloFullCurso() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(
      URL + endpoints.key + endpoints.keygenerarfull + endpoints.keycurso,
      {
        headers: { authorization: serviceToken },
        responseType: 'blob', // Importante para manejar archivos binarios
      }
    );

    if (response.status === 200) {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Establece el nombre del archivo para la descarga
      link.setAttribute('download', 'plantilla_full_curso.xlsx');
      document.body.appendChild(link);

      // Forzar la descarga
      link.click();

      // Eliminar el enlace para limpiar el DOM
      document.body.removeChild(link);
    } else {
      console.error('Error al generar el archivo');
    }
  } catch (error) {
    console.error(error);
  }
}