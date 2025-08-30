import React, { useState } from 'react';
import './PetCard.css';

/**
 * Componente funcional PetCard para mostrar la información de una mascota.
 * Incluye funcionalidades para ver detalles, marcar comidas, editar y eliminar.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.mascota - El objeto de la mascota a mostrar.
 * @param {function} props.onToggleComida - Callback para cambiar el estado de la comida.
 * @param {function} props.onEditPet - Callback para iniciar la edición de la mascota.
 * @param {function} props.onDeletePet - Callback para eliminar la mascota.
 * @param {string} [props.mode='full'] - Modo de la tarjeta: 'full' para la vista principal, 'selection' para selección de historial. // CAMBIO: Nuevo prop
 * @param {function} [props.onSelectPet] - Callback para cuando se selecciona una mascota en modo 'selection'. // CAMBIO: Nuevo prop
 * @param {string|null} [props.currentSelectedPetId] - ID de la mascota actualmente seleccionada para resaltar. // CAMBIO: Nuevo prop
 */
function PetCard({
  mascota,
  onToggleComida,
  onEditPet,
  onDeletePet,
  mode = 'full', 
  onSelectPet, 
  currentSelectedPetId 
}) {
  // Estado para controlar la visibilidad del menú de detalles desplegable de la mascota.
  const [showDetails, setShowDetails] = useState(false);
  // Estado para controlar la visibilidad del menú de acciones (editar/eliminar).
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // CAMBIO: Modifica toggleDetails para que solo funcione en modo 'full'
  const toggleDetails = () => {
    if (mode === 'full') {
      setShowDetails(!showDetails);
      setShowActionsMenu(false); // Cierra el menú de acciones si se abren/cierran los detalles.
    }
  };

  /**
   * @param {Event} e - El evento de clic. Se usa para detener la propagación.
   */
  const toggleActionsMenu = (e) => {
    e.stopPropagation(); // Evita que el clic en el botón de opciones también active el toggleDetails del card.
    setShowActionsMenu(!showActionsMenu);
  };

  /**
   * Ejecuta una acción (editar o eliminar) y luego cierra el menú de acciones.
   * @param {function} actionFunction - La función de callback a ejecutar (onEditPet o onDeletePet).
   * @param {...any} args - Argumentos a pasar a la función de callback.
   */
  const handleAction = (actionFunction, ...args) => {
    actionFunction(...args); // Ejecuta la función pasada.
    setShowActionsMenu(false); // Cierra el menú.
  };

  // Lógica para la barra de progreso de alimentación y el estado de la comida
  // Estos cálculos solo son relevantes en modo 'full', pero se mantienen aquí para claridad.
  const porcionesComidasHoy = mascota.historialAlimentacion
    ? mascota.historialAlimentacion.filter(dosis => dosis.marcado).length
    : 0;

  const totalPorcionesEsperadas = mascota.vecesComidaEstimado || 1;
  const progresoPorcentaje = (porcionesComidasHoy / totalPorcionesEsperadas) * 100;

  // Lógica para el botón "Marcar próxima comida"
  const today = new Date().toISOString().split('T')[0];
  const proximaDosisIndex = mascota.historialAlimentacion
    ? mascota.historialAlimentacion.findIndex(dosis => dosis.fecha === today && !dosis.marcado)
    : -1;

  const handleMarcarProximaComida = () => {
    if (proximaDosisIndex !== -1) {
      onToggleComida(mascota.id, proximaDosisIndex);
    }
  };

  const puedeMarcarComida = proximaDosisIndex !== -1;
  const estaCompletado = porcionesComidasHoy === totalPorcionesEsperadas;

  // Calcula la ración diaria total estimada
  const cantidadPorcionGramos = mascota.historialAlimentacion && mascota.historialAlimentacion.length > 0
    ? mascota.historialAlimentacion[0].cantidadGramos
    : 0;
  const racionDiariaTotalEstimada = cantidadPorcionGramos * totalPorcionesEsperadas;

  // CAMBIO: Nueva función para manejar el clic en la tarjeta, dependiendo del modo
  const handleCardClick = () => {
    if (mode === 'selection' && onSelectPet) {
      onSelectPet(mascota.id); // Llama al callback de selección si está en modo 'selection'
    } else if (mode === 'full') {
      toggleDetails(); // Mantiene el comportamiento original de toggleDetails en modo 'full'
    }
  };

  // CAMBIO: Clase CSS para resaltar la tarjeta si está seleccionada en modo 'selection'
  const isSelectedForHistory = mode === 'selection' && currentSelectedPetId === mascota.id;

  return (
    // CAMBIO: Agrega la clase condicional 'selected-for-history-view' y 'pet-selection-card' si es modo 'selection'
    <div className={`pet-card ${mode === 'selection' ? 'pet-selection-card' : ''} ${isSelectedForHistory ? 'selected-for-history-view' : ''}`}
         onClick={handleCardClick} // CAMBIO: El div completo ahora es clicable para seleccionar en modo 'selection'
    >
      {/* Lógica para la imagen del avatar. Usa mascota.iconoRaza si existe, sino, un default. */}
      <img
        src={mascota.iconoRaza || "/cat_avatar.png"} // Usa el prop 'iconoRaza' o el default
        alt={mascota.nombre || "Mascota"} // Usa el nombre de la mascota para el alt
        className="pet-icon"
      />
      {/* CAMBIO: onClick en h3.pet-name ahora llama a handleCardClick */}
      <h3 className="pet-name" onClick={handleCardClick}>{mascota.nombre}</h3>
      <p className="pet-breed">{mascota.raza}</p>

      {/* CAMBIO: Renderizado condicional de elementos específicos del modo 'full' */}
      {mode === 'full' && (
        <>
          {/* Sección de estado de alimentación simplificada */}
          <div className="pet-food-status-simplified">
            <p className="food-status-text">
              {estaCompletado
                ? `¡Completó sus ${totalPorcionesEsperadas} comidas (${racionDiariaTotalEstimada}g) de hoy!`
                : `Hoy ha comido ${porcionesComidasHoy} de ${totalPorcionesEsperadas} porciones (${racionDiariaTotalEstimada}g).`}
            </p>
            <button
              onClick={handleMarcarProximaComida}
              disabled={!puedeMarcarComida}
              className="mark-food-button"
            >
              {estaCompletado ? "Completado" : "Marcar próxima comida"}
            </button>
          </div>

          {/* Barra de progreso de alimentación */}
          <div className="food-progress-container">
            <div className="food-progress-bar" style={{ width: `${progresoPorcentaje}%` }}></div>
            <div className="food-progress-text">{`${porcionesComidasHoy}/${totalPorcionesEsperadas} comidas`}</div>
          </div>

          {/* Contenedor del menú de 3 puntitos */}
          <div className="pet-card-options-toggle">
            <button className="options-button" onClick={toggleActionsMenu}>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </button>
            {showActionsMenu && (
              <div className="options-menu">
                <button onClick={() => handleAction(onEditPet, mascota)}>Editar</button>
                <button onClick={() => handleAction(onDeletePet, mascota.id)}>Eliminar</button>
              </div>
            )}
          </div>

          {/* Los detalles adicionales de la mascota se muestran condicionalmente */}
          {showDetails && (
            <div className="pet-details-dropdown">
              <p><strong>Peso:</strong> {mascota.peso} kg</p>
              <p><strong>Edad:</strong> {mascota.edad.anos} años, {mascota.edad.meses} meses</p>
              <p><strong>Ración diaria estimada:</strong> {racionDiariaTotalEstimada} gramos</p>
              {/* CAMBIO: Ajuste para mostrar correctamente vacunas y desparasitaciones si son objetos */}
              {mascota.historialVacunas && mascota.historialVacunas.length > 0 && (
                  <p><strong>Vacunas:</strong> {mascota.historialVacunas.map(v => v.nombreVacuna || v).join(', ')}</p>
              )}
              {mascota.historialDesparasitacion && mascota.historialDesparasitacion.length > 0 && (
                  <p><strong>Desparasitación:</strong> {mascota.historialDesparasitacion.map(d => d.nombreTratamiento || d).join(', ')}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PetCard;