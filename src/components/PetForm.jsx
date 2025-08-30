
import React, { useState, useEffect } from 'react';
import './PetForm.css';
import { catBreeds, domesticCatColors } from '../data/petData';

function PetForm({ petToEdit, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [peso, setPeso] = useState('');
  const [edadAnos, setEdadAnos] = useState('');
  const [edadMeses, setEdadMeses] = useState(0);
  const [colorPelaje, setColorPelaje] = useState('');

  useEffect(() => {
    if (petToEdit) {
      setNombre(petToEdit.nombre || '');
      setRaza(petToEdit.raza || '');
      setPeso(petToEdit.peso || '');
      setEdadAnos(petToEdit.edad?.anos || '');
      setEdadMeses(petToEdit.edad?.meses || 0);
      setColorPelaje(petToEdit.colorPelaje || '');
    } else {
      setNombre('');
      setRaza('');
      setPeso('');
      setEdadAnos('');
      setEdadMeses(0);
      setColorPelaje('');
    }
  }, [petToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let selectedIcon = '';

    if (raza === 'Gato doméstico' && colorPelaje) {

      selectedIcon = domesticCatColors.find(colorData => colorData.color === colorPelaje)?.icon;
    } else {

      selectedIcon = catBreeds.find(b => b.name === raza)?.icon;
    }


    if (!selectedIcon) {
        selectedIcon = '/icons/gato-domestico-default.png'; 
    }

    const petData = {
      nombre,
      raza,
      peso: parseFloat(peso),
      edad: {
        anos: parseInt(edadAnos),
        meses: parseInt(edadMeses)
      },
      iconoRaza: selectedIcon,
      colorPelaje: raza === 'Gato doméstico' ? colorPelaje : undefined,

    };

    onSubmit(petData);
  };

  return (
    <form className="pet-form" onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>

      <label>
        Raza:
        <select value={raza} onChange={(e) => setRaza(e.target.value)} required>
          <option value="">Selecciona una raza</option>
          {catBreeds.map((breed) => (
            <option key={breed.name} value={breed.name}>
              {breed.name}
            </option>
          ))}
        </select>
      </label>

      {raza === 'Gato doméstico' && (
        <label>
          Color de Pelaje:
          <select value={colorPelaje} onChange={(e) => setColorPelaje(e.target.value)} required={raza === 'Gato doméstico'}>
            <option value="">Selecciona un color</option>
            {domesticCatColors.map((colorData) => (
              <option key={colorData.color} value={colorData.color}>
                {colorData.color}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>
        Peso (kg):
        <input
          type="number"
          name="peso"
          step="0.1"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          required
        />
      </label>

      <label>
        Edad (años):
        <input
          type="number"
          name="edadAnos"
          value={edadAnos}
          onChange={(e) => setEdadAnos(e.target.value)}
          min="0"
          required
        />
      </label>

      <label>
        Edad (meses):
        <input
          type="number"
          name="edadMeses"
          value={edadMeses}
          onChange={(e) => setEdadMeses(e.target.value)}
          min="0"
          max="11"
          required
        />
      </label>

      <button type="submit">
        {petToEdit ? 'Guardar Cambios' : 'Agregar Mascota'}
      </button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}

export default PetForm;