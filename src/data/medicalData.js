// Intervalos en meses para vacunas
export const vaccineTypes = [
  { name: "Rabia", initialIntervalMonths: 3, subsequentIntervalMonths: 12, description: "Protege contra el virus de la rabia." },
  { name: "Triple Felina (FVRCP)", initialIntervalMonths: 1, subsequentIntervalMonths: 12, description: "Protege contra Rinotraqueitis, Calicivirus y Panleucopenia." },
  { name: "Leucemia Felina (FeLV)", initialIntervalMonths: 1, subsequentIntervalMonths: 12, description: "Recomendada para gatos con acceso al exterior o en contacto con otros gatos." },
  { name: "Peritonitis Infecciosa Felina (PIF)", initialIntervalMonths: 1, subsequentIntervalMonths: 12, description: "Vacuna para la Peritonitis Infecciosa Felina." },
  { name: "Clamidia (Chlamydophila)", initialIntervalMonths: 1, subsequentIntervalMonths: 12, description: "Vacuna contra Chlamydophila felis." },
];

// Intervalos en meses para desparasitaciones
export const dewormingTypes = [
  { name: "Amplio Espectro (Interna y Externa)", intervalMonthsIndoor: 6, intervalMonthsOutdoor: 3, description: "Protección contra parásitos internos y externos (pulgas, garrapatas)." },
  { name: "Parásitos Intestinales", intervalMonthsIndoor: 6, intervalMonthsOutdoor: 3, description: "Específica para gusanos redondos y planos." },
  { name: "Prevención de Pulgas/Garrapatas", intervalMonthsIndoor: 6, intervalMonthsOutdoor: 1, description: "Producto tópico o oral para control de ectoparásitos." },
];

export const calculateNextDueDate = (lastDateString, intervalMonths) => {
  if (!lastDateString || typeof intervalMonths !== 'number' || isNaN(intervalMonths)) {
    return '';
  }
  
  const lastDate = new Date(lastDateString + 'T00:00:00'); 

  if (isNaN(lastDate.getTime())) {
    return '';
  }

  const nextDate = new Date(lastDate);
  nextDate.setMonth(lastDate.getMonth() + intervalMonths);

  if (nextDate.getDate() !== lastDate.getDate() && nextDate.getDate() < lastDate.getDate()) {
      nextDate.setDate(0);
  }

  return nextDate.toISOString().split('T')[0];
};