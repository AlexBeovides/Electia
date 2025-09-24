import "@styles/CoursesCatalog.scss";
import { CourseInstanceCardProfessor } from "../../components/CourseInstanceCardProfessor";
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

export const CourseInstancesCatalogProfessor = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 6;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/CourseInstances/ForCatalog/FromProfessor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);

        // Map backend response to Course type
        const mappedCourses = data.map((course: any) => ({
            id: course.id, 
            title: course.title,
            center: course.centerName,
            modality: course.modalityName,
            imgUrl: course.imgUrl, // Default image URL
            startDate: course.startDate,
            endDate: course.endDate
            }));

        setCoursesData(mappedCourses);
      })
      .catch((error) => console.error("Error:", error));
  }, []); 

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
              <span>Mis Cursos Activos</span>
            </h1>
            
            <p>
              {" "}
              Bienvenido a la sección de Cursos Activos, profesor. Aquí encontrará las asignaturas que está impartiendo actualmente.
              Al seleccionar cualquiera de sus cursos activos, podrá acceder al 
              listado completo de estudiantes matriculados, gestionar la asistencia, asignar calificaciones y generar actas oficiales 
              con el formato establecido por la Universidad de La Habana. Esta herramienta le permite llevar un control eficiente del
              progreso académico de sus estudiantes y completar los procesos de evaluación con facilidad.
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
                  <CourseInstanceCardProfessor
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