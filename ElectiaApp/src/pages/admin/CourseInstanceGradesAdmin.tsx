import "@styles/CourseInstanceGradesProfessor.scss";
import '@styles/Manager.scss';
import { API_BASE_URL } from "../../config";
import { AG_GRID_LOCALE_ES } from '../../types/agGridLocaleEs';

import { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from 'ag-grid-community'; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
    id: number;
    studentName: string; 
    facultyName: string;
    majorName: string;
    academicYearName: string;
    finalGrade: number;
    extraGrade: number;
    mundialGrade: number;
    comment: string;
}

type Course = {
    id: number;
    name: string;
    professorName: string;
    endDate: Date;
};

export const CourseInstanceGradesAdmin = () => {
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
        { field: "academicYearName", headerName: 'Año Académico', filter: true },
        { field: "finalGrade", headerName: 'Examen Final' ,filter: true },
        { field: "extraGrade", headerName: 'Examen Extraordinario', filter: true },
        { field: "mundialGrade", headerName: 'Examen Mundial' ,filter: true},
        { field: "comment", headerName: 'Comentario' }, 
    ]);

    const defaultColDef: ColDef = {
        flex: 1,
    };

    const exportToExcel = async () => {
        try {
            if (!courseData || !courseData.endDate) {
                alert('No hay datos del curso disponibles. Por favor, inténtelo de nuevo.');
                return;
            }

            // Cargar el archivo acta.xlsx desde la carpeta public
            const response = await fetch('/electia-app/acta.xlsx');
            const arrayBuffer = await response.arrayBuffer();

            // Leer el archivo con ExcelJS
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            // Seleccionar la primera hoja
            const worksheet = workbook.getWorksheet(1);

            if (!worksheet) {
                throw new Error('La hoja de cálculo no existe en el archivo Excel.');
            }

            const courseEndDate = new Date(courseData.endDate);
            
            // Verificar que la fecha es válida
            if (isNaN(courseEndDate.getTime())) {
                throw new Error('La fecha del curso no es válida.');
            }

            const currentMonth = courseEndDate.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1
            const currentYear = courseEndDate.getFullYear();

            // Calcular el curso escolar (septiembre a agosto)
            let courseYear;
            if (currentMonth >= 9) { // Septiembre a diciembre
                courseYear = `${currentYear}-${currentYear + 1}`;
            } else { // Enero a agosto
                courseYear = `${currentYear - 1}-${currentYear}`;
            }

            // Calcular el semestre
            let semesterNumber: string;
            if (currentMonth >= 9 && currentMonth <= 12) { // Septiembre a diciembre
                semesterNumber = "1ro";
            } else if (currentMonth >= 1 && currentMonth <= 8) { // Enero a agosto
                semesterNumber = "2do";
            } else {
                // Fallback case (shouldn't happen with valid dates, but ensures type safety)
                semesterNumber = "";
            }

            // Agregar curso escolar en celda O2
            const cell = worksheet.getCell('O2');
            cell.value = {
                richText: [
                    { text: 'Curso Escolar: ' },
                    { text: courseYear, font: { bold: true , name: 'Calibri'} }
                ]
            };

            // Agregar semestre en celda P3
            const semesterCell = worksheet.getCell('P3'); // Ajusta la celda según necesites
            semesterCell.value = {
                richText: [
                    { text: 'Semestre: ' },
                    { text: semesterNumber, font: { bold: true, name: 'Calibri'  } }
                ]
            };

            // Agregar asignatura electiva en celda B4
            const subjectCell = worksheet.getCell('B4');
            subjectCell.value = {
                richText: [
                    { text: 'Asignatura electiva: ' },
                    { text: courseData.name, font: { bold: true, name: 'Calibri' } }
                ]
            };

            // Agregar nombre del profesor en celda K4
            const professorCell = worksheet.getCell('K4');
            professorCell.value = {
                richText: [
                    { text: 'Nombre del Profesor: ' },
                    { text: courseData.professorName, font: { bold: true, name: 'Calibri' } }
                ]
            };

            // Agregar datos de los estudiantes
            rowData.forEach((student, index) => {
                const row = 9 + index; // Comenzar en la fila 9
                worksheet.getCell(`C${row}`).value = student.studentName; // Nombre del estudiante
                worksheet.getCell(`H${row}`).value = student.finalGrade; // Nota final
                worksheet.getCell(`N${row}`).value = student.extraGrade; // Nota extraordinaria
                worksheet.getCell(`S${row}`).value = student.mundialGrade; // Nota mundial
            });

            // Calcular la última fila con datos
            const lastRowWithData = 9 + rowData.length - 1;
            
            // Ocultar todas las filas desde la siguiente a la última con datos hasta la fila 58
            for (let rowNum = lastRowWithData + 1; rowNum <= 58; rowNum++) {
                worksheet.getRow(rowNum).hidden = true;
            }

            // Descargar el archivo modificado
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Acta_Modificada_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.xlsx`);

            alert('Archivo exportado exitosamente.');
        } catch (error) {
            console.error('Error al exportar el archivo:', error);
            alert('Error al exportar el archivo. Por favor, inténtelo de nuevo.');
        }
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

            const mappedData: IRow[] = data.map((item: any) => ({
                id: item.id,
                studentName: item.studentName,
                facultyName: item.facultyName,
                majorName: item.majorName,
                academicYearName: item.academicYearName,
                finalGrade: item.grade1,
                extraGrade: item.grade2,
                mundialGrade: item.grade3,
                comment: item.comment,
            }));

            setRowData(mappedData);   

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
            const courseDate = instanceData.endDate;
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
                professorName: courseRaw.mainProfessorName,
                endDate: courseDate
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
                    <div className="navigation-links">
                        <a href={`${window.location.origin}/electia-app/admin/courses/?courseId=${courseData?.id}`}>Información del Curso</a>
                        <br></br>
                        <a href={`${window.location.origin}/electia-app/admin/course-instance-roster/?courseId=${courseInstanceId}`}>Matrícula del Curso</a>
                    </div>

                    <div className="export-section">
                        <button 
                            className="export-excel-btn" 
                            onClick={exportToExcel}
                            disabled={rowData.length === 0}
                        >
                            <span className="export-icon">📊</span>
                            EXPORTAR A EXCEL
                        </button>
                    </div>

                    <div className="grid-container">
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