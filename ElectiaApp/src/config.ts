// Configuración de API que funciona tanto en desarrollo como en Docker
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5097/api';