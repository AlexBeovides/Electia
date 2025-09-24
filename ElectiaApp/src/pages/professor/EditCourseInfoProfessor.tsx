import '@styles/Manager.scss';
import { API_BASE_URL } from '../../config';
import { useEffect, useState } from 'react'; 
import axios from "axios";
import { Option } from '../../types';

type Course = {
    id: number;
    title: string;
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
    strategicAxesId: number;
    strategicSectorsId: number;
    authorizationLetter: File | null;
    imgUrl: string;
};

export const EditCourseInfoProfessor = () => {
  const [course, setCourse] = useState<Course>({ 
    id: 0,
    title: '',
    enrollmentCapacity: 0,
    collaboratingProfessors: '',
    courseJustification: '',
    generalObjective: '', 
    specificObjectives: '',  
    courseSyllabus: '', 
    basicBibliography: '',  
    complementaryBibliography: '',  
    evaluationSystem: '',  
    modalityJustification: '',  
    basicRequirements: '', 
    meetingPlace: '', 
    strategicAxesId: 0,
    strategicSectorsId: 0,
    authorizationLetter: null,
    imgUrl: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const token = localStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

  const [strategicAxes, setStrategicAxes] = useState<Option[]>([]);
  const [strategicSectors, setStrategicSectors] = useState<Option[]>([]);

  // Fetch reference data
  useEffect(() => {
    axios.get(`${API_BASE_URL}/Courses/strategic-axes`).then((res) => setStrategicAxes(res.data));
    axios.get(`${API_BASE_URL}/Courses/strategic-sectors`).then((res) => setStrategicSectors(res.data));
  }, []);

  // Fetch course data
  useEffect(() => {
    if (courseId) {
      fetch(`${API_BASE_URL}/Courses/ForCatalog/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const authorizationLetterFile = data.authorizationLetterDataBase64
            ? base64ToFile(data.authorizationLetterDataBase64, 'AuthorizationLetter.pdf')
            : null;

          setCourse({
            id: data.id,
            title: data.title,
            enrollmentCapacity: data.enrollmentCapacity,
            collaboratingProfessors: data.collaboratingProfessors ?? '',
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
            strategicAxesId: data.strategicAxesId,
            strategicSectorsId: data.strategicSectorsId,
            authorizationLetter: authorizationLetterFile,
            imgUrl: data.imgUrl
          });
          
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
    }
  }, [courseId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCourse({ ...course, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdateSuccess(false);
  
    const formData = new FormData();

    let base64 = ''; 
    if (course.authorizationLetter) {
      base64 = await base64FromFile(course.authorizationLetter);
    }

    formData.append("Id", course.id.toString());
    formData.append("Title", course.title);
    formData.append("EnrollmentCapacity", course.enrollmentCapacity.toString());
    formData.append("CollaboratingProfessors", course.collaboratingProfessors);
    formData.append("CourseJustification", course.courseJustification);
    formData.append("GeneralObjective", course.generalObjective);
    formData.append("SpecificObjectives", course.specificObjectives);
    formData.append("CourseSyllabus", course.courseSyllabus);
    formData.append("BasicBibliography", course.basicBibliography);
    formData.append("ComplementaryBibliography", course.complementaryBibliography);
    formData.append("EvaluationSystem", course.evaluationSystem);
    formData.append("ModalityJustification", course.modalityJustification);
    formData.append("BasicRequirements", course.basicRequirements);
    formData.append("MeetingPlace", course.meetingPlace);
    formData.append("StrategicAxesId", course.strategicAxesId.toString());
    formData.append("StrategicSectorsId", course.strategicSectorsId.toString());
    formData.append("AuthorizationLetterDataBase64", base64);
    formData.append("ImgUrl", course.imgUrl);
    
    // console.log(course.strategicAxesId);
  
    fetch(`${API_BASE_URL}/Courses/ByProfessor/${courseId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } 
      })
      .then(data => {
        console.log("Course updated successfully:", data);
        alert("Curso Editado Correctamente!");
        setUpdateSuccess(true);
      })
      .catch(error => console.error('Error updating course:', error));
  };
 
  if (isLoading) {
    return <div>Cargando información del curso...</div>;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCourse({ ...course, authorizationLetter: file });
  };

  function base64FromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1]; // quitamos el data:*/*
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function base64ToFile(base64: string, fileName: string): File {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    return new File([blob], fileName, { type: 'application/pdf' });
  }
  
  return (
    <>
      <div className='courses-manager-professor-page-container'> 
        <h2 className='page-header'>Crear Curso Nuevo</h2>
        <div className='manager-container'>
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          <form className={`form-container ${isLoading ? 'loading' : ''}`} onSubmit={handleFormSubmit}>
            <div className="form-section">
              <h3 className="section-title">Información Básica</h3>
              
              <div className="form-row">
                <div>
                  <label>Título del curso <span>*</span></label>
                  <input 
                    type="text" 
                    name="title" 
                    value={course.title} 
                    onChange={handleInputChange} 
                    placeholder="Ingrese el título del curso" 
                    required 
                  />
                </div>
                
                <div>
                  <label>Capacidad de matrícula <span>*</span></label>
                  <input 
                    type="number" 
                    name="enrollmentCapacity" 
                    value={course.enrollmentCapacity || ""} 
                    onChange={handleInputChange} 
                    placeholder="Número de estudiantes" 
                    min="1"
                    required 
                  />
                </div>
              </div>

              <div className="form-row full-width">
                <div>
                  <label>Profesores Colaboradores</label>
                  <input 
                    type="text" 
                    name="collaboratingProfessors" 
                    value={course.collaboratingProfessors} 
                    onChange={handleInputChange} 
                    placeholder="Nombres de los profesores colaboradores" 
                  />
                </div>
              </div>

              <div className="form-row full-width">
                <div>
                  <label>Lugar de Encuentro <span>*</span></label>
                  <input 
                    type="text" 
                    name="meetingPlace" 
                    value={course.meetingPlace} 
                    onChange={handleInputChange} 
                    placeholder="Aula, edificio o ubicación del curso" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Contenido Académico</h3>
              
              <label>Fundamentación de la Asignatura (no más de 500 palabras) <span>*</span></label>
              <textarea 
                name="courseJustification" 
                value={course.courseJustification} 
                onChange={handleInputChange} 
                placeholder="Explique detalladamente la necesidad e importancia del curso, su relevancia académica y profesional..." 
                rows={4}
                required 
              />

              <label>Objetivo General <span>*</span></label>
              <textarea 
                name="generalObjective" 
                value={course.generalObjective} 
                onChange={handleInputChange} 
                placeholder="Describa el objetivo principal que persigue el curso, las competencias generales que desarrollará..." 
                rows={3}
                required 
              />

              <label>Objetivos Específicos <span>*</span></label>
              <textarea 
                name="specificObjectives" 
                value={course.specificObjectives} 
                onChange={handleInputChange} 
                placeholder="Liste los objetivos específicos del curso, habilidades particulares, conocimientos concretos que adquirirán los estudiantes..." 
                rows={4}
                required 
              />

              <label>Temario del curso <span>*</span></label>
              <textarea 
                name="courseSyllabus" 
                value={course.courseSyllabus} 
                onChange={handleInputChange} 
                placeholder="Detalle el contenido y temas a desarrollar, unidades temáticas, cronograma de contenidos..." 
                rows={6}
                required 
              />
            </div>

            <div className="form-section">
              <h3 className="section-title">Bibliografía y Evaluación</h3>
              
              <label>Bibliografía Básica <span>*</span></label>
              <textarea 
                name="basicBibliography" 
                value={course.basicBibliography} 
                onChange={handleInputChange} 
                placeholder="Liste las referencias bibliográficas principales con formato académico completo (autor, título, editorial, año, etc.)..." 
                rows={4}
                required 
              />

              <label>Bibliografía Complementaria <span>*</span></label>
              <textarea 
                name="complementaryBibliography" 
                value={course.complementaryBibliography} 
                onChange={handleInputChange} 
                placeholder="Referencias bibliográficas adicionales, recursos complementarios, artículos de investigación, sitios web especializados..." 
                rows={4}
                required 
              />

              <label>Sistema de Evaluación <span>*</span></label>
              <textarea 
                name="evaluationSystem" 
                value={course.evaluationSystem} 
                onChange={handleInputChange} 
                placeholder="Describa detalladamente la metodología de evaluación: tipos de evaluación, porcentajes, criterios de calificación, fechas importantes..." 
                rows={4}
                required 
              />

              <label>Justificación de la Modalidad <span>*</span></label>
              <textarea 
                name="modalityJustification" 
                value={course.modalityJustification} 
                onChange={handleInputChange} 
                placeholder="Explique las razones para la modalidad seleccionada, ventajas pedagógicas, recursos necesarios, metodología de enseñanza..." 
                rows={3}
                required 
              />

              <label>Requisitos Básicos <span>*</span></label>
              <textarea 
                name="basicRequirements" 
                value={course.basicRequirements} 
                onChange={handleInputChange} 
                placeholder="Especifique los requisitos previos para tomar el curso: conocimientos previos, cursos prerequisito, habilidades técnicas..." 
                rows={3}
                required 
              />
            </div>

            <div className="form-section">
              <h3 className="section-title">Clasificación Estratégica</h3>
              
              <div className="form-row">
                <div>
                  <label>Eje Estratégico <span>*</span></label>
                  <select name="strategicAxesId" 
                  value={course.strategicAxesId !== undefined ? course.strategicAxesId : ""}
                  // value={course.strategicAxesId || ""} 
                  onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione el eje estratégico</option>
                    {strategicAxes.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Sector Estratégico <span>*</span></label>
                  <select name="strategicSectorsId" 
                  value={course.strategicSectorsId !== undefined ? course.strategicSectorsId : ""}
                  // value={course.strategicSectorsId || ""} 
                  onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione el sector estratégico</option>
                    {strategicSectors.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Recursos Adicionales</h3>
              
              <label>Enlace a Imagen del Curso</label>
              <input 
                type="text" 
                name="imgUrl" 
                value={course.imgUrl} 
                onChange={handleInputChange} 
                placeholder="URL de la imagen representativa del curso"
              />
              
              <label htmlFor="courseFile">Carta de Autorización (PDF)</label>
              <input
                type="file"
                id="courseFile"
                name="courseFile"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
            </div>

            <button 
              className='my-button' 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando curso...' : 'Actualizar curso'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
