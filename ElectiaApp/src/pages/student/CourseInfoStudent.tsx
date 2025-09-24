import "@styles/CourseInfo.scss";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import { Option } from '../../types';
import MultilineText from '../../components/MultilineText'; 
import axios from "axios";

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

type Application = {
  motivationLetter: string,
  academicYearId: number
}

export const CourseInfoStudent = () => {
  const [courseData, setCourseData] = useState<Course>(); 
  const [applicationStatus, setApplicationStatus] = useState<number>(-1);
  const [newApplication, setNewApplication] = useState<Application>({ 
    motivationLetter: '', 
    academicYearId: 0
  });

  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

  const isCourseNotStarted = courseData?.startDate 
    ? new Date(courseData.startDate) > new Date() 
    : false;

  const [academicYears, setAcademicYears] = useState<Option[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Students/academic-years`).then((res) => setAcademicYears(res.data));
  }, []);

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
          imgUrl: data.imgUrl,
          
          startDate: data.startDate,
          endDate: data.endDate
        };

        setCourseData(mappedCourse);
      })
      .catch((error) => console.error("Error:", error));

      if (courseId && token) {
        console.log(courseId, token);

        fetch(`${API_BASE_URL}/CourseApplications/isApplicant?courseId=${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => response.json())
        .then(data => {
          console.log("Is Applicant check:", data);
          setApplicationStatus(data.applicationStatus);
        })
        .catch(error => console.error("Applicant check error:", error));
      }

  }, []);

  const handleInscription = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/CourseApplications/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        courseId: courseId,
        motivationLetter: newApplication.motivationLetter,
        academicYearId: newApplication.academicYearId
      }),
    });

    if (response.ok) {
      alert("Te has preinscrito satisfactoriamente en este curso");
    }
    else{
      throw new Error(`Failed to apply: ${response.statusText}`);
    }
    
    setApplicationStatus(0);     
  };

  const handleWithdraw = async () => {
    if (!courseId) return;

    const response = await fetch(`${API_BASE_URL}/CourseApplications/withdraw/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) { 
      setApplicationStatus(-1);
      alert("Has retirado tu aplicacion de manera satisfactoria");
    } else {
      throw new Error(`Failed to withdraw from course: ${response.statusText}`); 
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewApplication({ ...newApplication, [event.target.name]: event.target.value });
  };

  return (
    <div className="course-info-page-container">
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

            {/* Sección de Inscripción */}
            <div className="enrollment-section">
              {applicationStatus === -1 ? (
                // No ha aplicado
                <div className="enrollment-form-container">
                  <h2 className="section-title">📝 Solicitar Inscripción</h2>
                  <form className="enrollment-form" onSubmit={handleInscription}>
                    <div className="form-group">
                      <label htmlFor="motivationLetter">
                        ¿Por qué deseas matricularte en esta electiva? *
                      </label>
                      <textarea
                        id="motivationLetter"
                        name="motivationLetter"
                        value={newApplication.motivationLetter}
                        onChange={(e) => setNewApplication({...newApplication, motivationLetter: e.target.value})}
                        placeholder="Comparte tu motivación para cursar esta asignatura..."
                        required
                        rows={4}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="academicYearId">Año Académico *</label>
                      <select 
                        id="academicYearId"
                        name="academicYearId" 
                        value={newApplication.academicYearId || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Seleccione año académico</option>
                        {academicYears
                          .filter(m => m.id !== 0)
                          .map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button className="btn-enroll" type="submit">
                      🚀 Preinscribirse al Curso
                    </button>
                  </form>
                </div>
              ) : applicationStatus === 0 ? (
                // Aplicación pendiente
                <div className="enrollment-status pending">
                  <div className="status-icon">⏳</div>
                  <div className="status-content">
                    <h3>Solicitud en Revisión</h3>
                    <p>Tu solicitud de inscripción ha sido enviada y está siendo revisada por el equipo académico.</p>
                    <p className="status-note">Te notificaremos a traves de la aplicación cuando se asignen las plazas</p>
                    {isCourseNotStarted && (
                      <button className="btn-withdraw" onClick={handleWithdraw}>
                        Cancelar Solicitud
                      </button>
                    )}
                  </div>
                </div>
              ) : applicationStatus === 1 ? (
                // Aplicación aceptada
                <div className="enrollment-status accepted">
                  <div className="status-icon">✅</div>
                  <div className="status-content">
                    <h3>¡Inscripción Aprobada!</h3>
                    <p>¡Felicitaciones! Tu solicitud ha sido aprobada y ya estás oficialmente inscrito en este curso.</p>
                    <p className="status-note">Recibirás más información sobre el inicio de clases próximamente.</p>
                    {isCourseNotStarted && (
                      <button className="btn-withdraw" onClick={handleWithdraw}>
                        Cancelar Inscripción
                      </button>
                    )}
                  </div>
                </div>
              ) : applicationStatus === 2 ? (
                // Aplicación rechazada
                <div className="enrollment-status rejected">
                  <div className="status-icon">❌</div>
                  <div className="status-content">
                    <h3>Solicitud No Aprobada</h3>
                    <p>Lamentamos informarte que tu solicitud de inscripción no fue aprobada en esta ocasión.</p>
                    <p className="status-note">Puedes contactar a la Dirección de Formación de Pregrado para más información o aplicar a otros cursos disponibles.</p>
                  </div>
                </div>
              ) : null}
            </div>
        </div>
      </div>
    </div>
  );
};