import "@styles/CourseInfo.scss";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import MultilineText from '../../components/MultilineText'; 

type Course = {
  id: number,
  title: string;
  center: string;
  modality: string;
  enrollmentCapacity: number;
  mainProfessor: string;
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

export const CourseInfoAdmin = () => {
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
          mainProfessor: data.mainProfessorName,
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

  const approveCourse = () => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas aprobar este curso?");
    
    if (!isConfirmed) {
      return;
    }

    fetch(`${API_BASE_URL}/Courses/Approve/${courseId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 1 }),
    })
      .then((response) => {
        if (response.ok) {
          setCourseData((prev) => prev && { ...prev, status: 1 });
          alert("Curso aprobado exitosamente.");
        } else {
          alert("Error al aprobar el curso.");
        }
      })
      .catch((error) => console.error("Error:", error));
};

  const rejectCourse = () => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas rechazar este curso?");
  
    if (!isConfirmed) {
      return;
    }

    fetch(`${API_BASE_URL}/Courses/Reject/${courseId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 2 }),
    })
      .then((response) => {
        if (response.ok) {
          setCourseData((prev) => prev && { ...prev, status: 2 });
          alert("Curso rechazado exitosamente.");
        } else {
          alert("Error al rechazar el curso.");
        }
      })
      .catch((error) => console.error("Error:", error));
};

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

            {(courseData?.status == 0) && (
              <div className="approval-section">
                <button onClick={approveCourse} className="btn-approve">
                  ✅ Aprobar Curso
                </button>

                <button onClick={rejectCourse} className="btn-reject">
                  ❌ Rechazar Curso
                </button>
              </div>
            )}
        </div>  

          {/* Profesorado */}
          <div className="info-section">
            <h2 className="section-title">👨‍🏫 Profesorado</h2>
            <div className="professor-info">
              <div className="main-professor">
                <h3>Profesor Principal</h3>
                <p>{courseData?.mainProfessor}</p>
              </div>
              {courseData?.collaboratingProfessors && (
                <div className="collaborating-professors">
                  <h3>Profesores Colaboradores</h3>
                  <MultilineText text={courseData.collaboratingProfessors}/>
                </div>
              )}
            </div>
          </div>

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
 