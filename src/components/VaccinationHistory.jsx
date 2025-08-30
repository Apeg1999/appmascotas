import React from 'react';
import './VaccinationHistory.css'; 

const VaccinationHistory = ({ pet, onAddVaccination, onEditVaccination, onDeleteVaccination }) => {
  if (!pet) {
    return <div className="vaccination-history-container">Selecciona una mascota para ver su historial de vacunas.</div>;
  }

  return (
    <div className="vaccination-history-container">
      <h2>Historial de Vacunas de {pet.name}</h2>
      <button className="add-vaccination-button" onClick={() => onAddVaccination(pet.id)}>
        + Añadir Vacuna
      </button>
      {pet.vaccinations && pet.vaccinations.length > 0 ? (
        <ul className="vaccination-list">
          {pet.vaccinations.map(vac => (
            <li key={vac.id} className="vaccination-item">
              <div className="vaccination-details">
                <h3>{vac.name}</h3>
                <p><strong>Fecha:</strong> {vac.date}</p>
                <p><strong>Próxima dosis:</strong> {vac.nextDueDate || 'N/A'}</p>
                {vac.notes && <p className="vaccination-notes"><strong>Notas:</strong> {vac.notes}</p>}
              </div>
              <div className="vaccination-actions">
                <button className="edit-button" onClick={() => onEditVaccination(pet.id, vac.id)}>Editar</button>
                <button className="delete-button" onClick={() => onDeleteVaccination(pet.id, vac.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-vaccinations-message">No hay vacunas registradas para {pet.name} aún.</p>
      )}
    </div>
  );
};

export default VaccinationHistory;