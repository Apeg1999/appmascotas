
import React from 'react';
import './DewormingHistory.css';

const DewormingHistory = ({ pet, onAddDeworming, onEditDeworming, onDeleteDeworming }) => {
  const dewormingRecords = pet.historialDesparasitacion || [];

  return (
    <div className="deworming-history-container">
      <div className="history-header">
        <h2>Historial de Desparasitación de {pet.nombre}</h2>
        <button className="add-button" onClick={() => onAddDeworming(pet.id)}>
          + Añadir Desparasitación
        </button>
      </div>

      {dewormingRecords.length === 0 ? (
        <p className="no-records-message">No hay registros de desparasitación para {pet.nombre}.</p>
      ) : (
        <ul className="deworming-list">
          {dewormingRecords.map(record => (
            <li key={record.id} className="deworming-item">
              <div className="deworming-details">
                <h3>{record.name}</h3>
                <p><strong>Fecha:</strong> {record.date}</p>
                {record.nextDueDate && <p><strong>Próxima Dosis:</strong> {record.nextDueDate}</p>}
                {record.notes && <p><strong>Notas:</strong> {record.notes}</p>}
              </div>
              <div className="deworming-actions">
                <button
                  className="edit-button"
                  onClick={() => onEditDeworming(pet.id, record.id)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDeleteDeworming(pet.id, record.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DewormingHistory;