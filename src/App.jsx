import React, { useState, useEffect } from 'react';
import { cargarMascotas, agregarMascota, actualizarMascota, eliminarMascota } from './services/localStorageService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PetCard from './components/PetCard';
import PetForm from './components/PetForm';
import { calculateDailyFoodAmount } from './data/petData';
import './App.css';
import VaccinationHistory from './components/VaccinationHistory';
import VaccineFormModal from './components/VaccineFormModal';
import DewormingHistory from './components/DewormingHistory';
import DewormingFormModal from './components/DewormingFormModal';
import { v4 as uuidv4 } from 'uuid';
import CatFactTranslator from './components/CatFactTranslator';

function App() {
    const [mascotas, setMascotas] = useState([]);
    const [isAddPetFormOpen, setIsAddPetFormOpen] = useState(false);
    const [petToEdit, setPetToEdit] = useState(null);
    const [activeView, setActiveView] = useState('home');
    const [selectedPetIdForHistory, setSelectedPetIdForHistory] = useState(null);

    const [isVaccineFormOpen, setIsVaccineFormOpen] = useState(false);
    const [vaccineToEdit, setVaccineToEdit] = useState(null);
    const [petIdForVaccineForm, setPetIdForVaccineForm] = useState(null);

    const [isDewormingFormOpen, setIsDewormingFormOpen] = useState(false);
    const [dewormingToEdit, setDewormingToEdit] = useState(null);
    const [petIdForDewormingForm, setPetIdForDewormingForm] = useState(null);

    useEffect(() => {
        let mascotasGuardadas = cargarMascotas();

       
        setMascotas(mascotasGuardadas);

        let shouldUpdateLocalStorage = false;
        const today = new Date().toISOString().split('T')[0];

        // Solo ejecuta la lógica de actualización diaria si hay mascotas cargadas
        if (mascotasGuardadas.length > 0) {
            const updatedMascotas = mascotasGuardadas.map(pet => {
                let petCopy = { ...pet };

                const { dailyGrams, mealsPerDay } = calculateDailyFoodAmount(petCopy.edad, petCopy.peso);
                petCopy.vecesComidaEstimado = mealsPerDay;

                const todayHistorial = petCopy.historialAlimentacion ? petCopy.historialAlimentacion.filter(d => d.fecha === today) : [];
                const currentMealsToday = todayHistorial.length;

                if (currentMealsToday === 0 || currentMealsToday !== mealsPerDay) {
                    petCopy.historialAlimentacion = [];
                    for (let i = 0; i < mealsPerDay; i++) {
                        const existingDosis = todayHistorial.find(d => d.dosis === i + 1);
                        petCopy.historialAlimentacion.push({
                            fecha: today,
                            dosis: i + 1,
                            marcado: existingDosis ? existingDosis.marcado : false,
                            cantidadGramos: Math.round(dailyGrams / mealsPerDay)
                        });
                    }
                    shouldUpdateLocalStorage = true;
                } else {
                    let changedGrams = false;
                    petCopy.historialAlimentacion = petCopy.historialAlimentacion.map(dosis => {
                        if (dosis.fecha === today) {
                            const newGramsPerServing = Math.round(dailyGrams / mealsPerDay);
                            if (dosis.cantidadGramos !== newGramsPerServing) {
                                changedGrams = true;
                                return { ...dosis, cantidadGramos: newGramsPerServing };
                            }
                        }
                        return dosis;
                    });
                    if (changedGrams) {
                        shouldUpdateLocalStorage = true;
                    }
                }

                petCopy.vaccinations = petCopy.vaccinations || [];
                petCopy.historialDesparasitacion = petCopy.historialDesparasitacion || [];

                return petCopy;
            });

            if (shouldUpdateLocalStorage) {
                setMascotas(updatedMascotas);
                updatedMascotas.forEach(pet => actualizarMascota(pet));
            }
        }
    }, []);

    const handleSubmitPetForm = (petData) => {
        let petToSave = { ...petData };

        const { dailyGrams, mealsPerDay } = calculateDailyFoodAmount(petData.edad, petData.peso);
        petToSave.vecesComidaEstimado = mealsPerDay;

        const today = new Date().toISOString().split('T')[0];
        let currentHistorialForToday = petToSave.historialAlimentacion ? petToSave.historialAlimentacion.filter(d => d.fecha === today) : [];

        if (currentHistorialForToday.length === 0 || currentHistorialForToday.length !== mealsPerDay) {
            petToSave.historialAlimentacion = [];
            for (let i = 0; i < mealsPerDay; i++) {
                const existingDosis = currentHistorialForToday.find(d => d.dosis === i + 1);
                petToSave.historialAlimentacion.push({
                    fecha: today,
                    dosis: i + 1,
                    marcado: existingDosis ? existingDosis.marcado : false,
                    cantidadGramos: Math.round(dailyGrams / mealsPerDay)
                });
            }
        } else {
            petToSave.historialAlimentacion = petToSave.historialAlimentacion.map(dosis => {
                if (dosis.fecha === today) {
                    return { ...dosis, cantidadGramos: Math.round(dailyGrams / mealsPerDay) };
                }
                return dosis;
            });
        }

        if (petToEdit) {
            const existingPet = mascotas.find(p => p.id === petToEdit.id);
            if (existingPet) {
                const otherDaysHistorial = existingPet.historialAlimentacion.filter(d => d.fecha !== today);
                petToSave.historialAlimentacion = [...otherDaysHistorial, ...petToSave.historialAlimentacion.filter(d => d.fecha === today)];

                petToSave.vaccinations = existingPet.vaccinations || [];
                petToSave.historialDesparasitacion = existingPet.historialDesparasitacion || [];
                petToSave.avatar = existingPet.avatar || '';
            }
            handleUpdatePet({ ...petToSave, id: petToEdit.id });
        } else {
            const mascotaConId = agregarMascota({
                ...petToSave,
                id: uuidv4(),
                vaccinations: [],
                historialDesparasitacion: []
            });
            setMascotas((prevMascotas) => [...prevMascotas, mascotaConId]);
        }

        setIsAddPetFormOpen(false);
        setPetToEdit(null);
    };

    const handleToggleComida = (mascotaId, dosisIndex) => {
        setMascotas(prevMascotas => {
            const updatedMascotas = prevMascotas.map(mascota => {
                if (mascota.id === mascotaId) {
                    if (mascota.historialAlimentacion && mascota.historialAlimentacion[dosisIndex]) {
                        const newHistorial = [...mascota.historialAlimentacion];
                        newHistorial[dosisIndex] = {
                            ...newHistorial[dosisIndex],
                            marcado: !newHistorial[dosisIndex].marcado
                        };
                        const updatedMascota = { ...mascota, historialAlimentacion: newHistorial };
                        actualizarMascota(updatedMascota);
                        return updatedMascota;
                    }
                }
                return mascota;
            });
            return updatedMascotas;
        });
    };

    const handleDeletePet = (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
            eliminarMascota(id);
            setMascotas(prevMascotas => prevMascotas.filter(mascota => mascota.id !== id));
            if (selectedPetIdForHistory === id) {
                setSelectedPetIdForHistory(null);
            }
        }
    };

    const handleEditPet = (mascota) => {
        setPetToEdit(mascota);
        setIsAddPetFormOpen(true);
    };

    const handleUpdatePet = (updatedPet) => {
        actualizarMascota(updatedPet);
        setMascotas(prevMascotas =>
            prevMascotas.map(mascota => (mascota.id === updatedPet.id ? updatedPet : mascota))
        );
    };

    const handleCloseAddPetForm = () => {
        setIsAddPetFormOpen(false);
        setPetToEdit(null);
    };

    const handleSidebarNavClick = (viewName) => {
        setActiveView(viewName);
        setIsAddPetFormOpen(false);
        setPetToEdit(null);
        setSelectedPetIdForHistory(null);
    };

    const handleSelectPetForHistory = (petId) => {
        setSelectedPetIdForHistory(petId);
    };

    const handleAddVaccination = (petId, vaccineData) => {
        const newVaccination = { id: uuidv4(), ...vaccineData };
        setMascotas(prevMascotas => {
            const updatedMascotas = prevMascotas.map(mascota => {
                if (mascota.id === petId) {
                    const updatedPet = {
                        ...mascota,
                        vaccinations: [...(mascota.vaccinations || []), newVaccination],
                    };
                    actualizarMascota(updatedPet);
                    return updatedPet;
                }
                return mascota;
            });
            return updatedMascotas;
        });
        setIsVaccineFormOpen(false);
        setVaccineToEdit(null);
        setPetIdForVaccineForm(null);
    };

    const handleEditVaccination = (petId, vaccineId, updatedVaccineData) => {
        setMascotas(prevMascotas => {
            const updatedMascotas = prevMascotas.map(mascota => {
                if (mascota.id === petId) {
                    const updatedVaccinations = mascota.vaccinations.map(vac =>
                        vac.id === vaccineId ? { ...vac, ...updatedVaccineData } : vac
                    );
                    const updatedPet = { ...mascota, vaccinations: updatedVaccinations };
                    actualizarMascota(updatedPet);
                    return updatedPet;
                }
                return mascota;
            });
            return updatedMascotas;
        });
        setIsVaccineFormOpen(false);
        setVaccineToEdit(null);
        setPetIdForVaccineForm(null);
    };

    const handleDeleteVaccination = (petId, vaccineId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta vacuna?')) {
            setMascotas(prevMascotas => {
                const updatedMascotas = prevMascotas.map(mascota => {
                    if (mascota.id === petId) {
                        const updatedVaccinations = mascota.vaccinations.filter(vac => vac.id !== vaccineId);
                        const updatedPet = { ...mascota, vaccinations: updatedVaccinations };
                        actualizarMascota(updatedPet);
                        return updatedPet;
                    }
                    return mascota;
                });
                return updatedMascotas;
            });
        }
    };

    const openVaccineForm = (petId, vaccine = null) => {
        setPetIdForVaccineForm(petId);
        setVaccineToEdit(vaccine);
        setIsVaccineFormOpen(true);
    };

    const handleAddDeworming = (petId, dewormingData) => {
        const newDeworming = { id: uuidv4(), ...dewormingData };
        setMascotas(prevMascotas => {
            const updatedMascotas = prevMascotas.map(mascota => {
                if (mascota.id === petId) {
                    const updatedPet = {
                        ...mascota,
                        historialDesparasitacion: [...(mascota.historialDesparasitacion || []), newDeworming],
                    };
                    actualizarMascota(updatedPet);
                    return updatedPet;
                }
                return mascota;
            });
            return updatedMascotas;
        });
        setIsDewormingFormOpen(false);
        setDewormingToEdit(null);
        setPetIdForDewormingForm(null);
    };

    const handleEditDeworming = (petId, dewormingId, updatedDewormingData) => {
        setMascotas(prevMascotas => {
            const updatedMascotas = prevMascotas.map(mascota => {
                if (mascota.id === petId) {
                    const updatedDewormings = mascota.historialDesparasitacion.map(rec =>
                        rec.id === dewormingId ? { ...rec, ...updatedDewormingData } : rec
                    );
                    const updatedPet = { ...mascota, historialDesparasitacion: updatedDewormings };
                    actualizarMascota(updatedPet);
                    return updatedPet;
                }
                return mascota;
            });
            return updatedMascotas;
        });
        setIsDewormingFormOpen(false);
        setDewormingToEdit(null);
        setPetIdForDewormingForm(null);
    };

    const handleDeleteDeworming = (petId, dewormingId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro de desparasitación?')) {
            setMascotas(prevMascotas => {
                const updatedMascotas = prevMascotas.map(mascota => {
                    if (mascota.id === petId) {
                        const updatedDewormings = mascota.historialDesparasitacion.filter(rec => rec.id !== dewormingId);
                        const updatedPet = { ...mascota, historialDesparasitacion: updatedDewormings };
                        actualizarMascota(updatedPet);
                        return updatedPet;
                    }
                    return mascota;
                });
                return updatedMascotas;
            });
        }
    };

    const openDewormingForm = (petId, deworming = null) => {
        setPetIdForDewormingForm(petId);
        setDewormingToEdit(deworming);
        setIsDewormingFormOpen(true);
    };

    const renderMainContent = () => {
        const selectedPet = mascotas.find(mascota => mascota.id === selectedPetIdForHistory);

        switch (activeView) {
            case 'home':
                return (
                    <div className="pet-cards-grid">
                        {mascotas.length === 0 ? (
                            <p className="no-pets-message">Aún no tienes mascotas registradas. ¡Haz clic en "+ Nuevo integrante?" para añadir una!</p>
                        ) : (
                            mascotas.map((mascota) => (
                                <PetCard
                                    key={mascota.id}
                                    mascota={mascota}
                                    onToggleComida={handleToggleComida}
                                    onEditPet={handleEditPet}
                                    onDeletePet={handleDeletePet}
                                    mode="full"
                                />
                            ))
                        )}
                    </div>
                );
            case 'vacunas':
                return (
                    <>
                        {selectedPetIdForHistory && selectedPet ? (
                            <VaccinationHistory
                                pet={selectedPet}
                                onAddVaccination={(petId) => openVaccineForm(petId, null)}
                                onEditVaccination={(petId, vaccineId) => {
                                    const vaccine = selectedPet.vaccinations.find(v => v.id === vaccineId);
                                    openVaccineForm(petId, vaccine);
                                }}
                                onDeleteVaccination={handleDeleteVaccination}
                            />
                        ) : (
                            <div className="vaccination-history-container">
                                <h2>Selecciona una mascota para ver su historial de vacunas</h2>
                                <div className="pet-selection-grid">
                                    {mascotas.length === 0 ? (
                                        <p className="no-pets-message">Aún no tienes mascotas para gestionar vacunas. ¡Añade una primero!</p>
                                    ) : (
                                        mascotas.map(mascota => {
                                            const lastVaccine = mascota.vaccinations && mascota.vaccinations.length > 0
                                                ? mascota.vaccinations.reduce((latest, current) => {
                                                    return new Date(latest.date) > new Date(current.date) ? latest : current;
                                                }, mascota.vaccinations[0])
                                                : null;

                                            return (
                                                <PetCard
                                                    key={mascota.id}
                                                    mascota={{
                                                        ...mascota,
                                                        // Agrega una propiedad para la última vacuna para mostrar en la tarjeta de selección
                                                        ultimaVacunaInfo: lastVaccine ? `${lastVaccine.name} (${lastVaccine.date})` : 'No hay vacunas registradas.'
                                                    }}
                                                    mode="selection"
                                                    onSelectPet={handleSelectPetForHistory}
                                                    currentSelectedPetId={selectedPetIdForHistory}
                                                />
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'citas':
                return <div className="placeholder-view"><h2>Citas</h2><p>Aquí podrás gestionar las citas de tus mascotas.</p></div>;
            case 'alimentacion':
                return (
                    <>
                        {selectedPetIdForHistory && selectedPet ? (
                            <div className="placeholder-view">
                                <h2>Alimentación de {selectedPet.nombre}</h2>
                                <p>Aquí podrás registrar la alimentación de {selectedPet.nombre}.</p>
                                {/* Puedes renderizar un componente de alimentación detallado aquí */}
                            </div>
                        ) : (
                            <div className="vaccination-history-container"> {/* Reutiliza este contenedor */}
                                <h2>Selecciona una mascota para registrar su alimentación</h2>
                                <div className="pet-selection-grid">
                                    {mascotas.length === 0 ? (
                                        <p className="no-pets-message">Aún no tienes mascotas para gestionar la alimentación. ¡Añade una primero!</p>
                                    ) : (
                                        mascotas.map(mascota => (
                                            <PetCard
                                                key={mascota.id}
                                                mascota={mascota}
                                                mode="selection"
                                                onSelectPet={handleSelectPetForHistory}
                                                currentSelectedPetId={selectedPetIdForHistory}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'desparasitacion':
                const currentPetForDeworming = mascotas.find(mascota => mascota.id === selectedPetIdForHistory);
                return (
                    <>
                        {selectedPetIdForHistory && currentPetForDeworming ? (
                            <DewormingHistory
                                pet={currentPetForDeworming}
                                onAddDeworming={(petId) => openDewormingForm(petId, null)}
                                onEditDeworming={(petId, dewormingId) => {
                                    const deworming = currentPetForDeworming.historialDesparasitacion.find(rec => rec.id === dewormingId);
                                    openDewormingForm(petId, deworming);
                                }}
                                onDeleteDeworming={handleDeleteDeworming}
                            />
                        ) : (
                            <div className="vaccination-history-container">
                                <h2>Selecciona una mascota para ver su historial de desparasitación</h2>
                                <div className="pet-selection-grid">
                                    {mascotas.length === 0 ? (
                                        <p className="no-pets-message">Aún no tienes mascotas para gestionar desparasitaciones. ¡Añade una primero!</p>
                                    ) : (
                                        mascotas.map(mascota => {
                                            const lastDeworming = mascota.historialDesparasitacion && mascota.historialDesparasitacion.length > 0
                                                ? mascota.historialDesparasitacion.reduce((latest, current) => {
                                                    return new Date(latest.date) > new Date(current.date) ? latest : current;
                                                }, mascota.historialDesparasitacion[0])
                                                : null;
                                            return (
                                                <PetCard
                                                    key={mascota.id}
                                                    mascota={{
                                                        ...mascota,
                                                        ultimaDesparasitacionInfo: lastDeworming ? `${lastDeworming.name} (${lastDeworming.date})` : 'No hay registros de desparasitación.'
                                                    }}
                                                    mode="selection"
                                                    onSelectPet={handleSelectPetForHistory}
                                                    currentSelectedPetId={selectedPetIdForHistory}
                                                />
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'notas':
                return <div className="placeholder-view"><h2>Notas</h2><p>Un espacio para todas las notas importantes de tus mascotas.</p></div>;
            default:
                return (
                    <p className="no-pets-message">Selecciona una opción del menú lateral.</p>
                );
        }
    };

    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <Sidebar
                    onNewPetClick={() => { setIsAddPetFormOpen(true); setPetToEdit(null); setActiveView('home'); }}
                    onNavClick={handleSidebarNavClick}
                    activeView={activeView}
                />
                <div className="pet-list-area">
                    {/* Añadido el componente CatFactTranslator */}
                    <CatFactTranslator />
                    {renderMainContent()}
                </div>
            </div>

            {isAddPetFormOpen && (
                <div className="add-pet-modal">
                    <div className="modal-content">
                        <h2>{petToEdit ? "Editar Integrante" : "Agregar Nuevo Integrante"}</h2>
                        <PetForm
                            petToEdit={petToEdit}
                            onSubmit={handleSubmitPetForm}
                            onCancel={handleCloseAddPetForm}
                        />
                    </div>
                </div>
            )}

            {isVaccineFormOpen && (
                <VaccineFormModal
                    petId={petIdForVaccineForm}
                    vaccineToEdit={vaccineToEdit}
                    onSave={vaccineToEdit ? (data) => handleEditVaccination(petIdForVaccineForm, vaccineToEdit.id, data) : handleAddVaccination}
                    onClose={() => { setIsVaccineFormOpen(false); setVaccineToEdit(null); setPetIdForVaccineForm(null); }}
                />
            )}

            {isDewormingFormOpen && (
                <DewormingFormModal
                    petId={petIdForDewormingForm}
                    dewormingToEdit={dewormingToEdit}
                    onSave={dewormingToEdit ? (data) => handleEditDeworming(petIdForDewormingForm, dewormingToEdit.id, data) : handleAddDeworming}
                    onClose={() => { setIsDewormingFormOpen(false); setDewormingToEdit(null); setPetIdForDewormingForm(null); }}
                />
            )}
        </div>
    );
}

export default App;