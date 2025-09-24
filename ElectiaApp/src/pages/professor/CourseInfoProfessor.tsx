import "@styles/CourseInfo.scss";
import "@styles/CourseInfoProfessor.scss";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import MultilineText from '../../components/MultilineText'; 

type Course = {
  id: number,
  title: string;
  center: string;
  modality: string;
  enrollmentCapacity: number;
  collaboratingProfessors: string;
  courseJustification: string;
  generalObjective: string;
  specificObjectives: string;
  courseSyllabus: string;
  basicBibliography: string;
  complementaryBibliography: string;
  evaluationSystem: string;
  modalityJustification: string;
  basicRequirements: string;
  meetingPlace: string;
  strategicAxesName: string;
  strategicSectorsName: string;
  autorizationLetterBase64: string;
  imgUrl: string;
  status: number;
};

export const CourseInfoProfessor = () => {
  const [courseData, setCourseData] = useState<Course>(); 

  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

  useEffect(() => {
    fetch(`${API_BASE_URL}/Courses/ForCatalog/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);

        const mappedCourse = {
          id: data.id,
          title: data.title,
          center: data.centerName,
          modality: data.modalityName,
          enrollmentCapacity: data.enrollmentCapacity,
          collaboratingProfessors: data.collaboratingProfessors,
          courseJustification: data.courseJustification,
          generalObjective: data.generalObjective,
          specificObjectives: data.specificObjectives,
          courseSyllabus: data.courseSyllabus,
          basicBibliography: data.basicBibliography,
          complementaryBibliography: data.complementaryBibliography,
          evaluationSystem: data.evaluationSystem,
          modalityJustification: data.modalityJustification,
          basicRequirements: data.basicRequirements,
          meetingPlace: data.meetingPlace,
          strategicAxesName: data.strategicAxesName,
          strategicSectorsName: data.strategicSectorsName,
          autorizationLetterBase64: data.authorizationLetterDataBase64, 
          imgUrl: data.imgUrl, // Default image URL
          status: data.status
        };

        setCourseData(mappedCourse);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const downloadAuthorizationLetter = () => {
    if (!courseData?.autorizationLetterBase64) {
      alert("No hay carta de autorización disponible.");
      return;
    }

    const byteCharacters = atob(courseData.autorizationLetterBase64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Crea un link invisible para disparar la descarga
    const link = document.createElement("a");
    link.href = url;
    link.download = `CartaAutorizacion_${courseData.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

 return (
    <div className="course-info-page-container course-info-professor-page-container">
      <div className="course-info-page">
        <div className="course-hero">
          <div className="course-hero-content">
            <h1 className="course-title">{courseData?.title}</h1>
            <div className="course-meta">
              <span className="course-center">📍 {courseData?.center}</span>
              <span className="course-modality">💻 {courseData?.modality}</span>
            </div>
          </div>
        </div>

        <div className="course-content">
          {/* Información General */}
          <div className="info-section">
            <h2 className="section-title">
              📅 Información General
              {!(courseData?.status == 1) && (
                <a
                  href={`/electia-app/professor/courses/edit/?courseId=${courseId}`}
                  className="edit-button"
                  title="Editar información general"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="20"
                    height="20"
                    fill="#4A5568"
                  >
                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                  </svg>
                </a>
              )}
            </h2> 
            
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Capacidad de Matrícula</div>
                <div className="info-value">{courseData?.enrollmentCapacity} estudiantes</div>
              </div>

              <div className="info-card">
                <div className="info-label">Lugar de Encuentro</div>
                <div className="info-value">{courseData?.meetingPlace || "Por definir"}</div>
              </div>

                            <div className="info-card">
                <div className="info-label">Estado del Curso</div>
                <div className="info-value">
                  {courseData?.status === 1 ? (
                    <span className="status-approved">✅ Aprobado</span>
                  ) : courseData?.status === 2 ? (
                    <span className="status-rejected">❌ Rechazado</span>
                  ) : (
                    <span className="status-pending">⏳ Pendiente de aprobación</span>
                  )}
                </div>
              </div>
            </div>
        </div>

          {/* Profesorado */}
          {courseData?.collaboratingProfessors && (
            <div className="info-section">
              <h2 className="section-title">👨‍🏫 Profesorado</h2>
              <div className="professor-info">
                  <div className="collaborating-professors">
                    <h3>Profesores Colaboradores</h3>
                    <MultilineText text={courseData.collaboratingProfessors}/>
                  </div>
                
              </div>
            </div>
          )}

          {/* Detalles del Curso */}
          <div className="info-section">
            <h2 className="section-title">📚 Detalles del Curso</h2>
            <div className="course-details">
              {courseData?.courseJustification && (
                <div className="detail-item">
                  <h3>Justificación del Curso</h3>
                  <MultilineText text={courseData.courseJustification}/>
                </div>
              )}

              {courseData?.generalObjective && (
                <div className="detail-item">
                  <h3>Objetivo General</h3>
                  <MultilineText text={courseData.generalObjective}/>
                </div>
              )}

              {courseData?.specificObjectives && (
                <div className="detail-item">
                  <h3>Objetivos Específicos</h3>
                  <MultilineText text={courseData.specificObjectives}/>
                </div>
              )}

              {courseData?.courseSyllabus && (
                <div className="detail-item">
                  <h3>Temario de la Asignatura</h3>
                  <MultilineText text={courseData.courseSyllabus}/>
                </div>
              )}

              {courseData?.basicRequirements && (
                <div className="detail-item">
                  <h3>Requisitos Básicos</h3>
                  <MultilineText text={courseData.basicRequirements}/>
                </div>
              )}

              {courseData?.evaluationSystem && (
                <div className="detail-item">
                  <h3>Sistema de Evaluación</h3>
                  <MultilineText text={courseData.evaluationSystem}/>
                </div>
              )}
            </div>
          </div>

          {/* Bibliografía */}
          {(courseData?.basicBibliography || courseData?.complementaryBibliography) && (
            <div className="info-section">
              <h2 className="section-title">📖 Bibliografía</h2>
              <div className="bibliography">
                {courseData?.basicBibliography && (
                  <div className="biblio-section">
                    <h3>Bibliografía Básica</h3>
                    <MultilineText text={courseData.basicBibliography}/>
                  </div>
                )}

                {courseData?.complementaryBibliography && (
                  <div className="biblio-section">
                    <h3>Bibliografía Complementaria</h3>
                    <MultilineText text={courseData.complementaryBibliography}/>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información Estratégica */}
          <div className="info-section">
            <h2 className="section-title">🎯 Información Estratégica</h2>
            <div className="strategic-info">
              <div className="strategic-item">
                <h3>Ejes Estratégicos</h3>
                <p>{courseData?.strategicAxesName}</p>
              </div>
              <div className="strategic-item">
                <h3>Sectores Estratégicos</h3>
                <p>{courseData?.strategicSectorsName}</p>
              </div>
            </div>
          </div>

          {/* Imagen del Curso */}
          {courseData?.imgUrl && (
            <div className="info-section">
              <h2 className="section-title">🖼️ Imagen del Curso</h2>
              <div className="course-image-container">
                <img 
                  src={courseData.imgUrl} 
                  alt={`Imagen del curso ${courseData.title}`}
                  className="course-image"
                />
                <div className="image-link-container">
                  <a 
                    href={courseData.imgUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="image-link"
                  >
                    🔗 Ver imagen en tamaño completo
                  </a>
                </div>
              </div>
            </div>
          )}

          {courseData?.autorizationLetterBase64 && (
            <div className="info-section">
              <h2 className="section-title">📄 Carta de Autorización</h2>
              <div className="authorization-letter-container">
                <div className="authorization-info">
                  <p className="authorization-description">
                    Carta de autorización oficial del curso. Haz clic en el botón de abajo para descargar el documento PDF.
                  </p>
                  <button 
                    onClick={downloadAuthorizationLetter}
                    className="btn-download-authorization"
                  >
                    📥 Descargar Carta de Autorización
                  </button>
                </div>
              </div>
            </div>
          )}

           
        </div>
      </div>
    </div>
  );
};
 