import '@styles/CoursesManagerProfessor.scss';
import { API_BASE_URL } from '../../config'; 
import { useEffect, useState } from 'react'; 
import axios from "axios";
import { Option } from '../../types';

type Course = {
    id: number;
    title: string;
    centerId: number;
    modalityId: number; // enum id
    enrollmentCapacity: number;
    mainProfessorId: string;
    collaboratingProfessors: string,
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
    isDeleted: boolean;
};

export const CoursesManagerProfessor = () => { 
  const [newCourse, setNewCourse] = useState<Course>({ 
    id: 0,
    title: '',
    centerId: 0,
    modalityId: 0,
    enrollmentCapacity: 0,
    mainProfessorId: '',
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
    imgUrl: '',
    isDeleted: false 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');
  
  const [centers, setCenters] = useState<Option[]>([]); 
  const [modalities, setModalities] = useState<Option[]>([]);
  const [strategicAxes, setStrategicAxes] = useState<Option[]>([]);
  const [strategicSectors, setStrategicSectors] = useState<Option[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Centers`).then((res) => setCenters(res.data));
    axios.get(`${API_BASE_URL}/Courses/course-modalities`).then((res) => setModalities(res.data));
    axios.get(`${API_BASE_URL}/Courses/strategic-axes`).then((res) => setStrategicAxes(res.data));
    axios.get(`${API_BASE_URL}/Courses/strategic-sectors`).then((res) => setStrategicSectors(res.data));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewCourse({ ...newCourse, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    const formData = new FormData();

    let base64 = ''; 
    if (newCourse.authorizationLetter) {
      base64 = await base64FromFile(newCourse.authorizationLetter);
    }

    // Agregar los campos del curso al FormData
    formData.append("Title", newCourse.title);
    formData.append("CenterId", newCourse.centerId.toString());
    formData.append("ModalityId", newCourse.modalityId.toString());
    formData.append("EnrollmentCapacity", newCourse.enrollmentCapacity.toString());

    formData.append("CollaboratingProfessors", newCourse.collaboratingProfessors);
    formData.append("CourseJustification", newCourse.courseJustification);
    formData.append("GeneralObjective", newCourse.generalObjective);
    formData.append("SpecificObjectives", newCourse.specificObjectives);
    formData.append("CourseSyllabus", newCourse.courseSyllabus);
    formData.append("BasicBibliography", newCourse.basicBibliography);
    formData.append("ComplementaryBibliography", newCourse.complementaryBibliography);
    formData.append("EvaluationSystem", newCourse.evaluationSystem);
    formData.append("ModalityJustification", newCourse.modalityJustification);
    formData.append("BasicRequirements", newCourse.basicRequirements);
    formData.append("MeetingPlace", newCourse.meetingPlace);
    
    formData.append("StrategicAxesId", newCourse.strategicAxesId.toString());
    formData.append("StrategicSectorsId", newCourse.strategicSectorsId.toString());
 
    formData.append("AuthorizationLetterDataBase64", base64);
    
    formData.append("ImgUrl", newCourse.imgUrl);

    try {
      const response = await fetch(`${API_BASE_URL}/Courses/FromProfessor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("¡Curso creado satisfactoriamente!");
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setNewCourse({ 
          id: 0,
          title: '',
          centerId: 0,
          modalityId: 0,
          enrollmentCapacity: 0,
          mainProfessorId: '',
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
          imgUrl: '', 
          isDeleted: false 
        });
      } else {
        throw new Error('Error al crear el curso');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el curso. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setNewCourse({ ...newCourse, authorizationLetter: file });
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
                    value={newCourse.title} 
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
                    value={newCourse.enrollmentCapacity || ""} 
                    onChange={handleInputChange} 
                    placeholder="Número de estudiantes" 
                    min="1"
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Centro <span>*</span></label>
                  <select name="centerId" value={newCourse.centerId || ""} onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione el centro</option>
                    {centers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Modalidad del curso <span>*</span></label>
                  <select name="modalityId" value={newCourse.modalityId || ""} onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione la modalidad</option>
                    {modalities.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row full-width">
                <div>
                  <label>Profesores Colaboradores</label>
                  <input 
                    type="text" 
                    name="collaboratingProfessors" 
                    value={newCourse.collaboratingProfessors} 
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
                    value={newCourse.meetingPlace} 
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
                value={newCourse.courseJustification} 
                onChange={handleInputChange} 
                placeholder="Explique detalladamente la necesidad e importancia del curso, su relevancia académica y profesional..." 
                rows={4}
                required 
              />

              <label>Objetivo General <span>*</span></label>
              <textarea 
                name="generalObjective" 
                value={newCourse.generalObjective} 
                onChange={handleInputChange} 
                placeholder="Describa el objetivo principal que persigue el curso, las competencias generales que desarrollará..." 
                rows={3}
                required 
              />

              <label>Objetivos Específicos <span>*</span></label>
              <textarea 
                name="specificObjectives" 
                value={newCourse.specificObjectives} 
                onChange={handleInputChange} 
                placeholder="Liste los objetivos específicos del curso, habilidades particulares, conocimientos concretos que adquirirán los estudiantes..." 
                rows={4}
                required 
              />

              <label>Temario del curso <span>*</span></label>
              <textarea 
                name="courseSyllabus" 
                value={newCourse.courseSyllabus} 
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
                value={newCourse.basicBibliography} 
                onChange={handleInputChange} 
                placeholder="Liste las referencias bibliográficas principales con formato académico completo (autor, título, editorial, año, etc.)..." 
                rows={4}
                required 
              />

              <label>Bibliografía Complementaria <span>*</span></label>
              <textarea 
                name="complementaryBibliography" 
                value={newCourse.complementaryBibliography} 
                onChange={handleInputChange} 
                placeholder="Referencias bibliográficas adicionales, recursos complementarios, artículos de investigación, sitios web especializados..." 
                rows={4}
                required 
              />

              <label>Sistema de Evaluación <span>*</span></label>
              <textarea 
                name="evaluationSystem" 
                value={newCourse.evaluationSystem} 
                onChange={handleInputChange} 
                placeholder="Describa detalladamente la metodología de evaluación: tipos de evaluación, porcentajes, criterios de calificación, fechas importantes..." 
                rows={4}
                required 
              />

              <label>Justificación de la Modalidad <span>*</span></label>
              <textarea 
                name="modalityJustification" 
                value={newCourse.modalityJustification} 
                onChange={handleInputChange} 
                placeholder="Explique las razones para la modalidad seleccionada, ventajas pedagógicas, recursos necesarios, metodología de enseñanza..." 
                rows={3}
                required 
              />

              <label>Requisitos Básicos <span>*</span></label>
              <textarea 
                name="basicRequirements" 
                value={newCourse.basicRequirements} 
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
                  <select name="strategicAxesId" value={newCourse.strategicAxesId || ""} onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione el eje estratégico</option>
                    {strategicAxes.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Sector Estratégico <span>*</span></label>
                  <select name="strategicSectorsId" value={newCourse.strategicSectorsId || ""} onChange={handleInputChange} required>
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
                value={newCourse.imgUrl} 
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
              {isLoading ? 'Creando curso...' : 'Añadir nuevo curso'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};