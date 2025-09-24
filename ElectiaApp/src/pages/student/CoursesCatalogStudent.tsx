import "@styles/CoursesCatalog.scss";
import { CourseInstanceCard } from "../../components/CourseInstanceCard";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";

type Course = {
  id: number;
  title: string;
  center: string;
  modality: string;
  imgUrl: string;
  startDate: Date;
  endDate: Date;
};

type Student = {
  majorId: number,
  academicYear: number;
}

type Rule = {
  id: number;
  majorId: number | null;
  academicYear: number | null;
  priority: number | null;
}

export const CoursesCatalogStudent = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 6;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/Students/MyDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const studentDetails: Student = {
          majorId: data.majorId,
          academicYear: data.academicYear,
        };
        setStudentData(studentDetails);
      })
      .catch((error) =>
        console.error("Error fetching student details:", error)
      );
  }, []);

  // Función para verificar si el estudiante cumple con una regla
  const studentMeetsRule = (student: Student, rule: Rule): boolean => {
    const majorMatches = rule.majorId === null || rule.majorId === student.majorId;
    const yearMatches = rule.academicYear === null || rule.academicYear === student.academicYear;
    
    return majorMatches && yearMatches;
  };

  // Función para verificar si un curso es accesible para el estudiante
  const isCourseAccessible = async (courseId: number, student: Student): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Rules/ByCourseInstance/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        console.error(`Error fetching rules for course ${courseId}`);
        return false;
      }
      
      const rules: Rule[] = await response.json();
      
      // Filtrar solo las reglas con priority null
      const nullPriorityRules = rules.filter(rule => rule.priority === null);
      
      // Si no hay reglas con priority null, el curso no es accesible
      if (nullPriorityRules.length === 0) {
        return true;
      }
      
      // Verificar si el estudiante cumple con al menos una regla
      return nullPriorityRules.some(rule => studentMeetsRule(student, rule));
      
    } catch (error) {
      console.error(`Error fetching rules for course ${courseId}:`, error);
      return false;
    }
  };

  useEffect(() => {
    if (!studentData) return; // Prevenir ejecución prematura

    fetch(`${API_BASE_URL}/CourseInstances/ForCatalog/FromStudent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const mappedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          center: course.centerName,
          modality: course.modalityName,
          imgUrl: course.imgUrl,
          startDate: course.startDate,
          endDate: course.endDate,
        }));

        // Filtrar cursos accesibles para el estudiante
        const accessibleCourses: Course[] = [];
        
        for (const course of mappedCourses) {
          const isAccessible = await isCourseAccessible(course.id, studentData);
          if (isAccessible) {
            accessibleCourses.push(course);
          }
        }

        setCoursesData(accessibleCourses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [studentData]);

     // Calcular índices para la paginación
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = coursesData.slice(indexOfFirstCourse, indexOfLastCourse);

  // Calcular número total de páginas
  const totalPages = Math.ceil(coursesData.length / coursesPerPage);

  // Funciones de navegación
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="courses-catalog-page-container">
        
        <div className="courses-section">
          <div className="intro-text">
            <h1>
              <span>Catálogo de Cursos</span>
            </h1>
            
            <p>
              {" "}
              Bienvenido al Catálogo de Cursos Electivos de la Universidad de La Habana para el año académico 2024-2025. En esta plataforma encontrarás todas las asignaturas electivas disponibles para inscripción.
              Cada curso presenta información detallada sobre sus objetivos, contenidos, profesores, modalidad (presencial, virtual o híbrida) y requisitos para cursarla satisfactoriamente. Te invitamos a explorar las diversas opciones que contribuirán a tu formación integral y que responden a los ejes y sectores estratégicos de desarrollo del país.
              Para inscribirte, selecciona el curso de tu interés y completa el formulario correspondiente. Recuerda que cada asignatura tiene una capacidad limitada de matrícula, por lo que te recomendamos realizar tu inscripción lo antes posible.
              {" "}
            </p>
          </div>

          {/* Información de resultados */}
          <div className="results-info">
            <span>
              Mostrando {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, coursesData.length)} de {coursesData.length} cursos
            </span>
          </div>

          {coursesData.length === 0 ? (
            <h4 className="no-courses-message">
              (No hay cursos disponibles para esta categoría.)
            </h4>
          ) : (
            <>
              <div className="courses-container">
                {currentCourses.map((course, index) => (
                  <CourseInstanceCard
                    key={index}
                    name={course.title}
                    center={course.center}
                    url={course.imgUrl}
                    id={course.id}
                    startDate={course.startDate}
                    endDate={course.endDate}
                  />
                ))}
              </div>

              {/* Componente de paginación */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination">
                    {/* Botón Previous */}
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                      Anterior
                    </button>

                    {/* Números de página */}
                    <div className="page-numbers">
                      {getPageNumbers().map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>

                    {/* Botón Next */}
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                      Siguiente
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};