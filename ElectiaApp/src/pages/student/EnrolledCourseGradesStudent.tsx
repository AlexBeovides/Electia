import "@styles/CourseInstanceGradesProfessor.scss";
import '@styles/Manager.scss';
import { API_BASE_URL } from "../../config";
import { AG_GRID_LOCALE_ES } from '../../types/agGridLocaleEs';
import { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
    id: number;
    studentName: string; 
    facultyName: string;
    majorName: string;
    academicYear: string;
    grade: number;
    comment: string;
}

type Course = {
    id: number;
    name: string;
};

export const EnrolledCourseGradesStudent = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
    const [courseData, setCourseData] = useState<Course>();
    
    const urlParams = new URLSearchParams(window.location.search);
    const courseInstanceId = urlParams.get('courseId');
    const token = localStorage.getItem("token");

    const [rowData, setRowData] = useState<IRow[]>([]);

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { field: "studentName", headerName: 'Nombre'},
        { field: "facultyName", headerName: 'Facultad', filter: true },
        { field: "majorName", headerName: 'Carrera', filter: true },
        { field: "academicYear", headerName: 'Año Académico', filter: true },
        { field: "grade", headerName: 'Nota Final' },
        { field: "comment", headerName: 'Comentario'}, 
    ]);

    const defaultColDef: ColDef = {
        flex: 1,
    };

    const fetchCourseGrades = async () => {
        try {
            // Extraer el courseId de los parámetros de la URL
            
            if (!courseInstanceId) {
                throw new Error('No se encontró el courseId en la URL');
            }

            const response = await fetch(`${API_BASE_URL}/CourseGrades/ByCourse/${courseInstanceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                },
            });

            if (!response.ok) {
                throw new Error(`Error al obtener las calificaciones: ${response.status}`);
            }

            const data = await response.json();
            setRowData(data);  

            setLoading(false);
        } catch (error) {
            console.error('Error fetching course grades:', error);
            // Manejamos adecuadamente el error de tipo desconocido
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseGrades();
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
        try {
            // Primer fetch: obtener courseId desde CourseInstance
            const instanceResponse = await fetch(`${API_BASE_URL}/CourseInstances/${courseInstanceId}`, {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
            },
            });
    
            if (!instanceResponse.ok) throw new Error('Error al obtener CourseInstance');
    
            const instanceData = await instanceResponse.json();
            const courseId = instanceData.courseId;
    
            // Segundo fetch: obtener detalles del curso usando courseId
            const courseResponse = await fetch(`${API_BASE_URL}/Courses/ForCatalog/${courseId}`, {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
            },
            });
    
            if (!courseResponse.ok) throw new Error('Error al obtener Course');
    
            const courseRaw = await courseResponse.json();
    
            // Solo extraer id y title (title → name)
            const course: Course = {
            id: courseRaw.id,
            name: courseRaw.title, // Asumiendo que "title" es el nombre del curso
            };
            
            // console.log(course.name)
            setCourseData(course);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        };
    
        fetchCourseData();
    }, [courseInstanceId]);

    
    if (loading) {
        return <div className="p-4">Cargando calificaciones de estudiantes...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    return (
        <>
          <div className="manager-page-container">
            <h2 className="page-header">Evaluaciones de <span style={{textDecoration: 'underline'}}>{courseData?.name}</span></h2>
            <div className="section-container"> 
                {rowData.length === 0 ? (
                    <p>No hay calificaciones disponibles para este curso.</p>
                ) : (
                <div className="table-container"> 
                    <a href={`${window.location.origin}/electia-app/enrolled-courses/?courseId=${courseInstanceId}`}>Ver Información del Curso</a>
                    <br></br>
                    <br></br> 

                    <div style={{ height: 300, width: "60vw" }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 25, 50]}
                            localeText={AG_GRID_LOCALE_ES}
                            />
                    </div>
                </div>
                )}

            </div>
          </div>
        </>
    );
};