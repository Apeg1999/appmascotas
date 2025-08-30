// src/services/localStorageService.js
// Este servicio se encarga de interactuar con el Local Storage del navegador
// para guardar, cargar, actualizar y eliminar los datos de las mascotas.

const MASCOTAS_STORAGE_KEY = 'paw_keeper_mascotas';

/**
 * Carga las mascotas guardadas en Local Storage.
 * @returns {Array} Un array de objetos de mascotas o un array vacío si no hay datos.
 */
export const cargarMascotas = () => {
  try {
    const data = localStorage.getItem(MASCOTAS_STORAGE_KEY);
    // Si hay datos, los parsea de JSON a un objeto JavaScript.
    // Si no hay, devuelve un array vacío.
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al cargar mascotas de Local Storage:", error);
    return []; // En caso de error, devuelve un array vacío para evitar que la app se caiga.
  }
};

/**
 * Guarda el array actual de mascotas en Local Storage.
 * @param {Array} mascotas - El array de objetos de mascotas a guardar.
 */
const guardarMascotas = (mascotas) => {
  try {
    // Convierte el array de objetos a una cadena JSON y lo guarda en Local Storage.
    localStorage.setItem(MASCOTAS_STORAGE_KEY, JSON.stringify(mascotas));
  } catch (error) {
    console.error("Error al guardar mascotas en Local Storage:", error);
  }
};

/**
 * Agrega una nueva mascota al Local Storage.
 * Genera un ID único para la nueva mascota.
 * @param {object} nuevaMascota - El objeto de la nueva mascota (sin ID).
 * @returns {object} El objeto de la mascota con su ID asignado.
 */
export const agregarMascota = (nuevaMascota) => {
  const mascotasActuales = cargarMascotas();
  // Genera un ID único basado en la marca de tiempo y un número aleatorio.
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Crea el objeto final de la mascota con el ID y valores por defecto para historiales si no existen.
  const mascotaConId = {
    ...nuevaMascota,
    id,
    // Asegura que los historiales sean arrays vacíos si no se proporcionan,
    // esto es útil para nuevas mascotas.
    historialAlimentacion: nuevaMascota.historialAlimentacion || [],
    historialVacunas: nuevaMascota.historialVacunas || [],
    historialDesparasitacion: nuevaMascota.historialDesparasitacion || []
  };

  const nuevasMascotas = [...mascotasActuales, mascotaConId];
  guardarMascotas(nuevasMascotas); // Guarda la lista actualizada en Local Storage.
  return mascotaConId; // Devuelve la mascota con su ID para actualizar el estado en App.jsx.
};

/**
 * Actualiza una mascota existente en Local Storage.
 * @param {object} mascotaActualizada - El objeto de la mascota con los datos actualizados (debe incluir el ID).
 */
export const actualizarMascota = (mascotaActualizada) => {
  const mascotasActuales = cargarMascotas();
  const nuevasMascotas = mascotasActuales.map(mascota =>
    mascota.id === mascotaActualizada.id ? mascotaActualizada : mascota
  );
  guardarMascotas(nuevasMascotas); // Guarda la lista actualizada.
};

/**
 * Elimina una mascota de Local Storage por su ID.
 * @param {string} id - El ID de la mascota a eliminar.
 */
export const eliminarMascota = (id) => {
  const mascotasActuales = cargarMascotas();
  const nuevasMascotas = mascotasActuales.filter(mascota => mascota.id !== id);
  guardarMascotas(nuevasMascotas); // Guarda la lista sin la mascota eliminada.
};