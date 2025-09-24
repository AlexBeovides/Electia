import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "@styles/CoursesMainPageProfessor.scss";
import { API_BASE_URL } from '../../config';

interface ProfessorStats {
    coursesCreated: number;
    activeCourses: number;
    enrolledStudents: number;
}

export const CoursesMainPageProfessor = () => {
    const [stats, setStats] = useState<ProfessorStats>({
        coursesCreated: 0,
        activeCourses: 0,
        enrolledStudents: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/Professors/stats`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data: ProfessorStats = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas');
                console.error('Error fetching professor stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="courses-main-page-container">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Panel de Gestión de Cursos</h1>
                    <p className="page-subtitle">Selecciona una opción para comenzar</p>
                </header>

                <div className="options-grid">
                    <Link to="/electia-app/professor/courses-manager" className="option-card create-course">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Crear Nuevo Curso</h3>
                        <p className="card-description">
                            Diseña y configura un nuevo curso desde cero con todas sus características
                        </p>
                        <div className="card-arrow">→</div>
                    </Link>

                    <Link to="/electia-app/professor/courses-catalog" className="option-card modify-course">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3l-9.5 9.5-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Modificar Información</h3>
                        <p className="card-description">
                            Edita y actualiza la información de tus cursos existentes
                        </p>
                        <div className="card-arrow">→</div>
                    </Link>

                    <Link to="/electia-app/professor/course-instances-catalog" className="option-card active-courses">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Cursos Activos</h3>
                        <p className="card-description">
                            Gestiona y supervisa todos tus cursos actualmente en ejecución
                        </p>
                        <div className="card-arrow">→</div>
                    </Link>
                </div>                <div className="stats-section">
                    {loading ? (
                        <div className="loading-message">Cargando estadísticas...</div>
                    ) : error ? (
                        <div className="error-message">Error: {error}</div>
                    ) : (
                        <>
                            <div className="stat-item">
                                <span className="stat-number">{stats.coursesCreated}</span>
                                <span className="stat-label">Cursos Creados</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{stats.activeCourses}</span>
                                <span className="stat-label">Mis Cursos</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{stats.enrolledStudents}</span>
                                <span className="stat-label">Estudiantes Inscritos</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};