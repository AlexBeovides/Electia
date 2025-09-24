import "@styles/CourseInstanceGradesProfessor.scss";
import '@styles/Manager.scss';
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../../config"; 
import { AG_GRID_LOCALE_ES } from '../../types/agGridLocaleEs';
 
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type { ColDef, RowSelectionOptions } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
    id: number;
    studentName: string; 
    facultyName: string;
    majorName: string;
    academicYearName: string;
    primaryEmail: string;
    secondaryEmail: string;
    phoneNumber: string;
}

type Course = {
    id: number;
    name: string;
};

type Student = {
    id: string;
    name: string;
}

export const CourseInstanceRosterAdmin = () => { 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
    const [courseData, setCourseData] = useState<Course>();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [isRowDataReady, setIsRowDataReady] = useState(false);
    
    const urlParams = new URLSearchParams(window.location.search);
    const courseInstanceId = urlParams.get('courseId');
    const token = localStorage.getItem("token");

    const gridRef = useRef<AgGridReactType<IRow>>(null);

    const [rowData, setRowData] = useState<IRow[]>([]);

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { field: "studentName", headerName: 'Nombre'},
        { field: "facultyName", headerName: 'Facultad', filter: true },
        { field: "majorName", headerName: 'Carrera', filter: true },
        { field: "academicYearName", headerName: 'Año Académico', filter: true },
        { field: "primaryEmail", headerName: 'Correo Principal'},
        { field: "secondaryEmail", headerName: 'Correo Secundario'},
        { field: "phoneNumber", headerName: 'Número Teléfonico' },
    ]);

    const defaultColDef: ColDef = {
        flex: 1,
    };

    const rowSelection: RowSelectionOptions = {
        mode: 'multiRow',
        headerCheckbox: false,
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
            setIsRowDataReady(true);

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

    useEffect(() => {
        const fetchStudents = async () => {
            try { 
                const response = await fetch(`${API_BASE_URL}/CourseApplications/ByCourse/${courseInstanceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener los estudiantes: ${response.status}`);
                }

                const data = await response.json();
                console.log(data); 
                const existingNames = rowData.map(row => row.studentName);

                const mappedStudents = data.map((apiStudent: any) => ({
                    id: apiStudent.userId,
                    name: apiStudent.fullName
                }));

                const newStudents = mappedStudents.filter((student: Student) => !existingNames.includes(student.name)); 
                console.log(newStudents);
                setStudents(newStudents);
            } catch (error) {
                console.error('Error fetching students:', error);
                // Manejamos adecuadamente el error de tipo desconocido
                // const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                // setError(errorMessage);
                // setLoading(false);
            }
        };

        fetchStudents();
    }, [isRowDataReady]);

    const deleteSelectedRows = () => {
        const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
      
        if (selectedRows.length === 0) {
          alert('Por favor, selecciona al menos una fila para eliminar.');
          return;
        }
      
        const selectedIds = selectedRows.map(row => row.id);
      
        Promise.all(
          selectedIds.map(id =>
            fetch(`${API_BASE_URL}/CourseGrades/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        )
          .then(responses => {
            const allSuccessful = responses.every(response => response.ok);
            if (allSuccessful) {
              setRowData(prevData => prevData.filter(row => !selectedIds.includes(row.id)));
              alert('Estudiantes eliminados exitosamente.');
            } else {
              alert('Ocurrió un error al eliminar algunos estudiantes.');
            }
          })
          .catch(error => {
            console.error('Error al eliminar estudiantes:', error);
            alert('Ocurrió un error al eliminar los estudiantes.');
          });
      };
 
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 

        try {
            const response = await fetch(`${API_BASE_URL}/CourseGrades/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    StudentId: selectedStudentId,
                    CourseId: courseInstanceId
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al inscribir al estudiante");
            }
    
            const data = await response.json();
            console.log(data.message); // "Estudiante inscrito exitosamente."
            alert("Estudiante inscrito exitosamente");
    
            setSelectedStudentId(""); // Reset form
            await fetchCourseGrades();
        } catch (error) {
            const err = error as Error;
            console.error("Error inscribiendo al estudiante:", err);
            alert(err.message || "Hubo un error al inscribir al estudiante.");
        }
    };
    
    if (loading) {
        return <div className="p-4">Cargando calificaciones de estudiantes...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    return (
        <>
          <div className="manager-page-container"> 
            <h2 className="page-header">Matrícula de <span style={{textDecoration: 'underline'}}>{courseData?.name}</span></h2>
            <div className="section-container"> 
                <div className="table-container">
                    <a href={`${window.location.origin}/electia-app/admin/courses/?courseId=${courseData?.id}`}>Información del Curso</a>
                    <br></br>
                    <a href={`${window.location.origin}/electia-app/admin/course-instance-grades/?courseId=${courseInstanceId}`}>Notas del Curso</a>
                    <br></br>
                    <br></br> 

                    <div style={{ height: 300, width: "60vw" }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            rowSelection={rowSelection}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 25, 50]}
                            localeText={AG_GRID_LOCALE_ES}
                            />
                    </div>

                    <button
                        className="my-button delete-button"
                        style={{marginTop:"20px"}}
                        onClick={deleteSelectedRows}
                    >
                        Eliminar Filas Seleccionadas
                    </button>
                </div>

                <form className="form-container" onSubmit={handleFormSubmit}>
                    <label htmlFor="student">Selecciona un estudiante:</label>
                    <select
                        id="student"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        required
                    >
                        <option value="">-- Selecciona --</option>
                        {students.map((student, index) => (
                            <option key={student.id || `student-${index}`} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>

                    <button className="my-button" type="submit">
                        Añadir estudiante
                    </button>
                </form>
            </div>
          </div>
        </>
    );
};