
// Define las razas de gatos
export const catBreeds = [
  { name: "Gato doméstico", icon: "/icons/gato-domestico-default.png" },
  { name: "Siamés", icon: "src/icons/siames.png" },
  { name: "Persa", icon: "src/icons/persa.png" },
  { name: "Maine Coon", icon: "src/icons/maincoon.png" },
  { name: "Esfinge", icon: "src/icons/pelado.png" },
  
];

// Define los colores de pelaje para "Gato doméstico"
export const domesticCatColors = [
  { color: "Negro", icon: "src/icons/pelado.png" },
  { color: "Blanco", icon: "src/icons/blanco.png" },
  { color: "Naranja", icon: "src/icons/Naranjo.png" },
  { color: "Atigrado", icon: "src/icons/romano.png" },
  { color: "Calicó", icon: "/src/icons/calico.png" },
];

//razas de perros, pendiente
export const dogBreeds = [
  // { name: "Labrador", icon: "/icons/perro-labrador.png" },
  // ...
];


export const feedingGuidelines = {
  kitten: { // Gatito (0-12 meses)
    minWeightKg: 0.5,
    maxWeightKg: 4, // Peso máximo para considerarlo "gatito"
    caloriesPerKg: 60, // Kcal/kg de peso corporal, por modificar o confirmar
    gramsPerKg: 10, // Gramos de alimento seco por kg de peso corporal (varía por alimento pero sirve de estimado)
    recommendedMealsPerDay: 3 // 3 comidas para gatitos
  },
  adult: { // Gato adulto (1-7 años)
    minWeightKg: 3,
    maxWeightKg: 7,
    caloriesPerKg: 40,
    gramsPerKg: 8,
    recommendedMealsPerDay: 2 // 2 comidas para adultos
  },
  senior: { // Gato senior (>7 años)
    minWeightKg: 3,
    maxWeightKg: 7,
    caloriesPerKg: 35,
    gramsPerKg: 7,
    recommendedMealsPerDay: 2 // 2 comidas para seniors
  }
};


export const calculateDailyFoodAmount = (ageInMonths, weightKg) => {
  let guideline = feedingGuidelines.adult; 

  const totalMonths = parseInt(ageInMonths.anos * 12) + parseInt(ageInMonths.meses);

  if (totalMonths <= 12) { // Hasta 12 meses es gatito
    guideline = feedingGuidelines.kitten;
  } else if (totalMonths > 84) { // Más de 7 años (84 meses) es senior
    guideline = feedingGuidelines.senior;
  }

  // Si el peso está fuera de los rangos comunes, usar un valor predeterminado o ajustar
  const effectiveWeight = Math.max(weightKg, guideline.minWeightKg || 1); 


  const dailyGrams = effectiveWeight * guideline.gramsPerKg;
  const mealsPerDay = guideline.recommendedMealsPerDay;

  return {
    dailyGrams: Math.round(dailyGrams), 
    mealsPerDay: mealsPerDay
  };
};