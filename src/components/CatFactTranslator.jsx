import React, { useState } from 'react';
import './CatFactTranslator.css';

function CatFactTranslator() {
    const [catFactOriginal, setCatFactOriginal] = useState('');
    const [catFactTranslated, setCatFactTranslated] = useState('');
    const [isLoadingFact, setIsLoadingFact] = useState(false);
    const [errorFact, setErrorFact] = useState(null);

    const TRANSLATION_API_URL = '/deepl-proxy'; // Proxy hacia https://api-free.deepl.com/v2/translate
    const CAT_FACT_URL = '/catfact-api'; // Proxy hacia https://catfact.ninja/fact

    const fetchAndTranslateCatFact = async () => {
        setIsLoadingFact(true);
        setErrorFact(null);
        setCatFactOriginal(''); // Limpiar el dato original anterior
        setCatFactTranslated(''); // Limpiar el dato traducido anterior

        try {
            console.log('1. Obteniendo hecho de gato desde:', CAT_FACT_URL);
            const catFactResponse = await fetch(CAT_FACT_URL);

            if (!catFactResponse.ok) {
                const errorBody = await catFactResponse.text();
                throw new Error(`Error al obtener el hecho de gato: ${catFactResponse.statusText}. ${errorBody}`);
            }

            const catFactData = await catFactResponse.json();
            const originalFact = catFactData.fact;

            if (!originalFact || typeof originalFact !== 'string') {
                throw new Error('No se pudo obtener un hecho válido del gato.');
            }

            setCatFactOriginal(originalFact);
            console.log('2. Hecho original:', originalFact);

            // DeepL API a menudo espera application/x-www-form-urlencoded
            const formBody = new URLSearchParams({
                text: originalFact,
                source_lang: 'EN',
                target_lang: 'ES',

            });

            const translateResponse = await fetch(TRANSLATION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody.toString(),
            });

            if (!translateResponse.ok) {
                const errorBody = await translateResponse.text();
                // Intenta parsear como JSON para obtener un error más detallado de DeepL si es posible
                let errorMessage = `Error al traducir: ${translateResponse.status} ${translateResponse.statusText}.`;
                try {
                    const parsedError = JSON.parse(errorBody);
                    //DeepL te da "message" o "detail"
                    if (parsedError.message) errorMessage += ` ${parsedError.message}`;
                    if (parsedError.detail) errorMessage += ` Detalles: ${JSON.stringify(parsedError.detail)}`;
                } catch (e) {
                    errorMessage += ` Respuesta: ${errorBody}`;
                }
                throw new Error(errorMessage);
            }

            const translatedData = await translateResponse.json();
            // DeepL Free API response structure: { "translations": [{ "text": "..." }] }
            const translatedText = translatedData.translations?.[0]?.text;

            if (!translatedText) {
                throw new Error('No se obtuvo una traducción válida de la API.');
            }

            setCatFactTranslated(translatedText);
        } catch (error) {
            console.error('Error en fetchAndTranslateCatFact:', error);
            setErrorFact(`No se pudo cargar el dato curioso: ${error.message}`);
        } finally {
            setIsLoadingFact(false);
            console.log('3. Operación finalizada.');
        }
    };

    return (
        <div className="cat-fact-translator-container">
            <h2>Dato Curioso de Gatos (Traducido)</h2>
            
            <button
                onClick={fetchAndTranslateCatFact}
                disabled={isLoadingFact}
                className="translate-button"
            >
                {isLoadingFact ? 'Cargando...' : 'Obtener Dato Curioso'}
            </button>
            
            {errorFact && <p className="error-message">{errorFact}</p>}
            
            {/* Mensaje de carga: solo se muestra si está cargando Y no hay datos previos o errores */}
            {isLoadingFact && !catFactOriginal && !catFactTranslated && !errorFact && (
                <p className="loading-message">Cargando...</p>
            )}

            {/* Muestra el contenido principal de los datos si hay algo que mostrar */}
            {(catFactTranslated || catFactOriginal) && (
                <div className="cat-fact-content">
                    {catFactOriginal && (
                        <div className="fact-section original">
                            <h3>Original:</h3>
                            <p>"{catFactOriginal}"</p>
                        </div>
                    )}
                    {catFactTranslated && (
                        <div className="fact-section translated">
                            <h3>Traducido:</h3>
                            <p>"{catFactTranslated}"</p>
                        </div>
                    )}
                </div>
            )}
            
            {/* Mensaje inicial: solo se muestra si no hay datos, no está cargando y no hay error */}
            {!catFactTranslated && !catFactOriginal && !isLoadingFact && !errorFact && (
                <p className="initial-message">Haz clic en el botón para obtener un dato curioso.</p>
            )}
        </div>
    );
}

export default CatFactTranslator;