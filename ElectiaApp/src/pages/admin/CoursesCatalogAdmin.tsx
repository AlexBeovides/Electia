import "@styles/CoursesCatalog.scss";
import { CourseCardAdmin } from "../../components/CourseCardAdmin";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";

type Course = {
  id: number;
  title: string;
  center: string;
  modality: string;
  imgUrl: string; 
  status: number;
};

export const CoursesCatalogAdmin = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [filter, setFilter] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 6;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/Courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Map backend response to Course type
        const mappedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          center: course.centerName,
          modality: course.modalityName,
          imgUrl: course.imgUrl,
          status: course.status,
        }));

        setCoursesData(mappedCourses);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Filtrar los cursos según el estado del filtro
  const filteredCourses = coursesData.filter((course) => {
    if (filter === "Aprobados") return course.status==1;
    if (filter === "Rechazados") return course.status==2;
    if (filter === "Pendientes") return course.status==0;
    return true; // "Todos"
  });

  // Resetear página cuando cambie el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Calcular índices para la paginación
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
              Bienvenido al Catálogo de Cursos Electivos, administrador.
              {" "}
            </p>

            <br></br>

            <div>
              <a href={`/electia-app/admin/course-instances-catalog`} style={{ marginTop: '40px' }}>
                Ver Convocatorias de Cursos
              </a>
            </div>
          </div>

          {/* Dropdown para filtrar */}
          <div className="filter-container">
            <label htmlFor="filter-dropdown" className="filter-label">
              Filtrar por:
            </label>
            <select
              id="filter-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-dropdown"
            >
              <option value="Todos">Todos</option>
              <option value="Aprobados">Aprobados</option>
              <option value="Rechazados">Rechazados</option>
              <option value="Pendientes">Pendientes</option>
            </select>
          </div>

          {/* Información de resultados */}
          <div className="results-info">
            <span>
              Mostrando {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} de {filteredCourses.length} cursos
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <h4 className="no-courses-message">
              (No hay cursos disponibles para esta categoría.)
            </h4>
          ) : (
            <>
              <div className="courses-container">
                {currentCourses.map((course, index) => (
                  <CourseCardAdmin
                    key={course.id}
                    name={course.title}
                    center={course.center}
                    url={course.imgUrl}
                    id={course.id}
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