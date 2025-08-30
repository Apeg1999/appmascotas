import React, { useState, useEffect } from 'react';
import './DewormingFormModal.css';
import { dewormingTypes, calculateNextDueDate } from '../data/medicalData';

const DewormingFormModal = ({ petId, dewormingToEdit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    environment: 'indoor', 
    nextDueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (dewormingToEdit) {
      setFormData({
        name: dewormingToEdit.name || '',
        date: dewormingToEdit.date || '',
        environment: dewormingToEdit.environment || 'indoor', 
        nextDueDate: dewormingToEdit.nextDueDate || '',
        notes: dewormingToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        environment: 'indoor',
        nextDueDate: '',
        notes: '',
      });
    }
  }, [dewormingToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === 'name' || name === 'date' || name === 'environment') { 
        const selectedDewormingType = dewormingTypes.find(d => d.name === updatedData.name);

        if (selectedDewormingType && updatedData.date) {
          let interval;
          // Usa el ambiente para decidir el intervalo
          if (updatedData.environment === 'indoor') {
            interval = selectedDewormingType.intervalMonthsIndoor;
          } else {
            interval = selectedDewormingType.intervalMonthsOutdoor;
          }
          
          if (typeof interval === 'number' && !isNaN(interval)) {
            updatedData.nextDueDate = calculateNextDueDate(
              updatedData.date,
              interval
            );
          } else {
            updatedData.nextDueDate = '';
          }
        } else {
          updatedData.nextDueDate = '';
        }
      }
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      alert('Por favor, ingresa el nombre y la fecha de la desparasitación.');
      return;
    }
    const dewormingToSave = {
      id: dewormingToEdit ? dewormingToEdit.id : Date.now(),
      name: formData.name,
      date: formData.date,
      environment: formData.environment, // Guardar el ambiente
      nextDueDate: formData.nextDueDate,
      notes: formData.notes
    };
    onSave(petId, dewormingToSave);
  };

  return (
    <div className="deworming-form-modal-overlay">
      <div className="deworming-modal-content">
        <h2>{dewormingToEdit ? 'Editar Desparasitación' : 'Añadir Nueva Desparasitación'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tipo de Desparasitación:</label>
            <select
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              {dewormingTypes.map((deworming) => (
                <option key={deworming.name} value={deworming.name}>
                  {deworming.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Fecha de Administración:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Selector de Ambiente */}
          <div className="form-group">
            <label>Ambiente de la mascota:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="environment"
                  value="indoor"
                  checked={formData.environment === 'indoor'}
                  onChange={handleChange}
                /> Interior (Indoor)
              </label>
              <label>
                <input
                  type="radio"
                  name="environment"
                  value="outdoor"
                  checked={formData.environment === 'outdoor'}
                  onChange={handleChange}
                /> Exterior (Outdoor)
              </label>
            </div>
          </div>
          {/* Fin selector de Ambiente */}

          <div className="form-group">
            <label htmlFor="nextDueDate">Próxima Dosis (Fecha Estimada):</label>
            <input
              type="date"
              id="nextDueDate"
              name="nextDueDate"
              value={formData.nextDueDate}
              onChange={handleChange}
              readOnly
              title="Esta fecha se calcula automáticamente."
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notas:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              {dewormingToEdit ? 'Guardar Cambios' : 'Añadir Desparasitación'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DewormingFormModal;