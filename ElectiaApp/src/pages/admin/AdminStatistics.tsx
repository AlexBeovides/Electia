import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import '../../styles/AdminStatistics.scss';
import { API_BASE_URL } from "../../config";

// Definir la interfaz Students según los datos proporcionados
interface Students {
    id: number;
    studentName: string; 
    facultyName: string;
    majorName: string;
    academicYearName: string;
    primaryEmail: string;
    secondaryEmail: string;
    grade1: number;
    phoneNumber: string;
}

// Datos de ejemplo para demostrar la funcionalidad
// const mockStudentData: Students[] = [
//     { id: 1, studentName: "Juan Pérez", facultyName: "Ingeniería", majorName: "Ingeniería de Sistemas", academicYearName: "2024", primaryEmail: "juan@email.com", secondaryEmail: "juan2@email.com", grade1: 85, phoneNumber: "123-456-7890" },
//     { id: 2, studentName: "María García", facultyName: "Ciencias", majorName: "Matemáticas", academicYearName: "2024", primaryEmail: "maria@email.com", secondaryEmail: "maria2@email.com", grade1: 92, phoneNumber: "123-456-7891" },
//     { id: 3, studentName: "Carlos López", facultyName: "Ingeniería", majorName: "Ingeniería Civil", academicYearName: "2024", primaryEmail: "carlos@email.com", secondaryEmail: "carlos2@email.com", grade1: 78, phoneNumber: "123-456-7892" },
//     { id: 4, studentName: "Ana Martínez", facultyName: "Humanidades", majorName: "Literatura", academicYearName: "2024", primaryEmail: "ana@email.com", secondaryEmail: "ana2@email.com", grade1: 88, phoneNumber: "123-456-7893" },
//     { id: 5, studentName: "Pedro Rodríguez", facultyName: "Ciencias", majorName: "Física", academicYearName: "2024", primaryEmail: "pedro@email.com", secondaryEmail: "pedro2@email.com", grade1: 95, phoneNumber: "123-456-7894" },
//     { id: 6, studentName: "Laura Sánchez", facultyName: "Ingeniería", majorName: "Ingeniería Industrial", academicYearName: "2024", primaryEmail: "laura@email.com", secondaryEmail: "laura2@email.com", grade1: 82, phoneNumber: "123-456-7895" },
//     { id: 7, studentName: "Diego Fernández", facultyName: "Humanidades", majorName: "Historia", academicYearName: "2024", primaryEmail: "diego@email.com", secondaryEmail: "diego2@email.com", grade1: 76, phoneNumber: "123-456-7896" },
//     { id: 8, studentName: "Sofía Morales", facultyName: "Ciencias", majorName: "Biología", academicYearName: "2024", primaryEmail: "sofia@email.com", secondaryEmail: "sofia2@email.com", grade1: 90, phoneNumber: "123-456-7897" },
// ];

export const AdminStatistics = () => {
    const [rowData, setRowData] = useState<Students[]>([]);
    const [isRowDataReady, setIsRowDataReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configuración para usar tu API (comentada para usar datos mock)
    const fetchCourseGrades = async () => {
        try {
            // Usar datos mock para demostración
            // En tu implementación real, descomenta el código de la API:
             
            const urlParams = new URLSearchParams(window.location.search);
            const courseInstanceId = urlParams.get('courseId');
            const token = localStorage.getItem("token");
            
            if (!courseInstanceId) {
                throw new Error('No se encontró el courseId en la URL');
            }

            const response = await fetch(`${API_BASE_URL}/CourseGrades/ByCourse/${courseInstanceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al obtener las calificaciones: ${response.status}`);
            }

            const data = await response.json();
            setRowData(data);
            setIsRowDataReady(true);
            setLoading(false);
            
            console.log(data);
            //    // Simular carga de datos
            // setTimeout(() => {
                //     setRowData(mockStudentData);
                    // setIsRowDataReady(true);
                    // setLoading(false);
            // }, 1000);
         

        } catch (error) {
            console.error('Error fetching course grades:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseGrades();
    }, []);

    // Procesar datos para distribución por facultad
    const getFacultyDistribution = () => {
        const facultyCount: { [key: string]: number } = {};
        
        rowData.forEach(student => {
            facultyCount[student.facultyName] = (facultyCount[student.facultyName] || 0) + 1;
        });

        return Object.entries(facultyCount).map(([name, value]) => ({
            name,
            value,
            percentage: ((value / rowData.length) * 100).toFixed(1)
        }));
    };

    // Procesar datos para distribución de notas
    const getGradeDistribution = () => {
    const gradeRanges = [
        { range: 'Sin Calificar', min: null, max: null, count: 0 }, // Para valores null
        { range: '2', min: 2, max: 2, count: 0 },
        { range: '3', min: 3, max: 3, count: 0 },
        { range: '4', min: 4, max: 4, count: 0 },
        { range: '5', min: 5, max: 5, count: 0 }
    ];

    rowData.forEach(student => {
        const grade = student.grade1;
        
        // Verificar si la nota es null, undefined o 0
        if (grade === null || grade === undefined || grade === 0) {
            gradeRanges[0].count++; // Incrementar el contador de "Sin Calificar"
        } else {
            // Para notas válidas, buscar el rango correspondiente
            gradeRanges.forEach((range, index) => {
                if (index > 0 && range.min !== null && range.max !== null) {
                    if (grade >= range.min && grade <= range.max) {
                        range.count++;
                    }
                }
            });
        }
    });

    return gradeRanges.map(range => ({
        range: range.range,
        count: range.count,
        percentage: rowData.length > 0 ? ((range.count / rowData.length) * 100).toFixed(1) : '0'
    }));
};

    // Colores para los gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    const facultyData = getFacultyDistribution();
    const gradeData = getGradeDistribution();
    const totalStudents = rowData.length;
    const averageGrade = (() => {
    const validGrades = rowData.filter(student => 
        student.grade1 !== null && 
        student.grade1 !== undefined && 
        student.grade1 !== 0
    );
    
    if (validGrades.length === 0) return '0';
    
    const sum = validGrades.reduce((acc, student) => acc + student.grade1, 0);
    return (sum / validGrades.length).toFixed(1);
})();


    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p>Cargando datos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <div className="error-icon">⚠️</div>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-statistics">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <h1>Dashboard de Distribución de Estudiantes</h1>
                    <p>Análisis de distribución por facultad y rendimiento académico</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-icon blue">
                                <Users size={24} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Total Estudiantes</p>
                                <p className="stat-value">{totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-icon green">
                                <GraduationCap size={24} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Facultades</p>
                                <p className="stat-value">{facultyData.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-icon yellow">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Promedio General</p>
                                <p className="stat-value">{averageGrade}</p>
                            </div>
                        </div>
                    </div>

                     
                </div>

                {/* Distribución por Facultad */}
                <div className="chart-section">
                    <div className="chart-header">
                        <h2>Distribución de Estudiantes por Facultad</h2>
                    </div>
                    <div className="chart-content">
                        <div className="chart-grid">
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={facultyData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {facultyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="faculty-list">
                                {facultyData.map((faculty, index) => (
                                    <div key={faculty.name} className="faculty-item">
                                        <div className="faculty-info">
                                            <div 
                                                className="faculty-color" 
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            ></div>
                                            <span className="faculty-name">{faculty.name}</span>
                                        </div>
                                        <div className="faculty-stats">
                                            <div className="faculty-count">{faculty.value}</div>
                                            <div className="faculty-percentage">{faculty.percentage}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distribución de Notas */}
                <div className="chart-section">
                    <div className="chart-header">
                        <h2>Distribución de Notas por Estudiantes</h2>
                    </div>
                    <div className="chart-content">
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={gradeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => [value, 'Estudiantes']}
                                        labelFormatter={(label: string) => `Rango: ${label}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="count" fill="#3B82F6" name="Cantidad de Estudiantes" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="grade-summary">
                            {gradeData.map((grade) => (
                                <div key={grade.range} className="grade-card">
                                    <div className="grade-count">{grade.count}</div>
                                    <div className="grade-range">{grade.range}</div>
                                    <div className="grade-percentage">{grade.percentage}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};