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
  imgUrl: string;

  startDate: Date;
  endDate: Date;
};
 

export const EnrolledCourseInfoStudent = () => {
  const [courseData, setCourseData] = useState<Course>();  
 
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");
  console.log(courseId);


  useEffect(() => {
    fetch(`${API_BASE_URL}/CourseInstances/ForCatalog/${courseId}`, {
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
          imgUrl: data.imgUrl, // Default image URL
          
          startDate: data.startDate,
          endDate: data.endDate
        };

        setCourseData(mappedCourse);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="course-info-page-container course-info-student-page-container">
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
            <h2 className="section-title">📅 Información General</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Fecha de Inicio</div>
                <div className="info-value">
                  {courseData?.startDate 
                    ? new Date(courseData.startDate).toLocaleDateString("es-ES", { 
                        day: "2-digit", 
                        month: "long", 
                        year: "numeric" 
                      }) 
                    : "No disponible"}
                </div>
              </div>

              <div className="info-card">
                <div className="info-label">Fecha de Culminación</div>
                <div className="info-value">
                  {courseData?.endDate 
                    ? new Date(courseData.endDate).toLocaleDateString("es-ES", { 
                        day: "2-digit", 
                        month: "long", 
                        year: "numeric" 
                      }) 
                    : "No disponible"}
                </div>
              </div>

              <div className="info-card">
                <div className="info-label">Capacidad de Matrícula</div>
                <div className="info-value">{courseData?.enrollmentCapacity} estudiantes</div>
              </div>

              <div className="info-card">
                <div className="info-label">Lugar de Encuentro</div>
                <div className="info-value">{courseData?.meetingPlace || "Por definir"}</div>
              </div>

              {/* Nueva tarjeta para ver calificaciones */}
              <div className="info-card grades-card">
                <div className="info-label">Mis Calificaciones</div>
                <div className="info-value">
                  <a 
                    href={`${window.location.origin}/electia-app/student/enrolled-course-grades/?courseId=${courseId}`}
                    className="grades-link"
                  >
                    📊 Ver Calificaciones
                  </a>
                </div>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};