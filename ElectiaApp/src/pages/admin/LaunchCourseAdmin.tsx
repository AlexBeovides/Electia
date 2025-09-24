import '@styles/Manager.scss';
import '@styles/LaunchCourseAdmin.scss'; 
import { API_BASE_URL } from '../../config'; 
import { useEffect, useState } from "react";
import axios from "axios";
type Course = {
  id: number;
  title: string;
  center: string;  
};

type CourseInstanceForm = {
  courseId: number;
  startDate: string;
  endDate: string;
};

type Rule = {
  id?: number;
  courseInstanceId: number;
  majorId: number | null;
  academicYear: number | null;
  priority?: number | null;
  isDeleted?: boolean;
};

type RuleFormData = {
  majorId: number | null;
  academicYear: number | null;
};

type Option = {
  id: number;
  name: string;
};

export const LaunchCourseAdmin = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]); 
  const [formData, setFormData] = useState<CourseInstanceForm>({
    courseId: 0,
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [majors, setMajors] = useState<Option[]>([]);
  const [academicYears, setAcademicYears] = useState<Option[]>([]);
 
  const [filterRules, setFilterRules] = useState<Rule[]>([]);
  const [newFilterRules, setNewFilterRules] = useState<RuleFormData[]>([]);
 
  const [priorityRules, setPriorityRules] = useState<Rule[]>([]);
  const [newPriorityRules, setNewPriorityRules] = useState<RuleFormData[]>([]);

  const [createdCourseInstanceId, setCreatedCourseInstanceId] = useState<number | null>(null);
  
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    fetch(`${API_BASE_URL}/Courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);
        // Filtrar y mapear solo los cursos aprobados
        const mappedCourses = data
          .filter((course: any) => course.status==1) // Filtrar cursos aprobados
          .map((course: any) => ({
            id: course.id,
            title: course.title,
            center: course.centerName, 
          }));
        setCoursesData(mappedCourses); 
        console.log(mappedCourses);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'courseId' ? parseInt(value) : value
    }));
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Majors`).then((res) => setMajors(res.data));
    axios.get(`${API_BASE_URL}/Students/academic-years`).then((res) => setAcademicYears(res.data)); 
  }, []);

  // ========== FUNCIONES PARA REGLAS DE FILTRADO ==========
  const handleNewFilterRuleChange = (index: number, field: 'majorId' | 'academicYear', value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setNewFilterRules(prev => prev.map((rule, i) => 
      i === index ? { ...rule, [field]: numValue } : rule
    ));
  };

  const addNewFilterRule = () => {
    setNewFilterRules(prev => [...prev, { majorId: null, academicYear: null }]);
  };

  const removeNewFilterRule = (index: number) => {
    setNewFilterRules(prev => prev.filter((_, i) => i !== index));
  };

  // ========== FUNCIONES PARA REGLAS DE PRIORIDAD ==========
  const handleNewPriorityRuleChange = (index: number, field: 'majorId' | 'academicYear', value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setNewPriorityRules(prev => prev.map((rule, i) => 
      i === index ? { ...rule, [field]: numValue } : rule
    ));
  };

  const addNewPriorityRule = () => {
    setNewPriorityRules(prev => [...prev, { majorId: null, academicYear: null }]);
  };

  const removeNewPriorityRule = (index: number) => {
    setNewPriorityRules(prev => prev.filter((_, i) => i !== index));
  };

  // Función para guardar reglas después de crear la instancia
  const saveRulesAfterCourseCreation = async (courseInstanceId: number) => {
    try {
      // Guardar reglas de filtrado
      const filterRulesToCreate = newFilterRules.filter(rule => rule.majorId !== null || rule.academicYear !== null);
      for (const rule of filterRulesToCreate) {
        await fetch(`${API_BASE_URL}/Rules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseInstanceId: courseInstanceId,
            majorId: rule.majorId,
            academicYear: rule.academicYear,
            priority: null,
            isDeleted: false
          }),
        });
      }

      // Guardar reglas de prioridad
      const priorityRulesToCreate = newPriorityRules.filter(rule => rule.majorId !== null || rule.academicYear !== null);
        for (let i = 0; i < priorityRulesToCreate.length; i++) {
          const rule = priorityRulesToCreate[i];
          await fetch(`${API_BASE_URL}/Rules`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              courseInstanceId: courseInstanceId,
              majorId: rule.majorId,
              academicYear: rule.academicYear,
              priority: i + 1,
              isDeleted: false
            }),
          });
        }
      } catch (error) {
        console.error('Error saving rules:', error);
        throw error;
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (formData.courseId === 0) {
      setMessage({ type: 'error', text: 'Por favor selecciona un curso' });
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      setMessage({ type: 'error', text: 'Por favor completa todas las fechas' });
      return;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setMessage({ type: 'error', text: 'La fecha de inicio debe ser anterior a la fecha de fin' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const courseInstanceData = {
        courseId: formData.courseId,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isDeleted: false
      };

      // Crear instancia del curso
      const response = await fetch(`${API_BASE_URL}/CourseInstances`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseInstanceData),
      });
          
      if (response.ok) {
        const createdInstance = await response.json();
        const courseInstanceId = createdInstance.id;
        
        // Guardar reglas después de crear la instancia
        await saveRulesAfterCourseCreation(courseInstanceId);
        
        setMessage({ type: 'success', text: 'Convocatoria y reglas creadas exitosamente' });
        
        // Limpiar el formulario y reglas
        setFormData({
          courseId: 0,
          startDate: '',
          endDate: ''
        });
        setNewFilterRules([]);
        setNewPriorityRules([]);
      } else {
        const errorData = await response.text();
        setMessage({ type: 'error', text: `Error al crear la convocatoria: ${errorData}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Intenta nuevamente.' });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <>
      <div className="launch-course-page-container">
        <div className="courses-section">
          <div className="intro-text">
            <h1>
              <span>🚀 Lanzar nueva Convocatoria</span>
            </h1>
            <p>
              Escoja un curso, su fecha de comienzo y fin.
            </p>
          </div>
          
          <div className="launch-course-container">
            <form onSubmit={handleSubmit} className="launch-course-form">
              <div className="form-group">
                <label htmlFor="courseId" className="form-label">
                  Seleccionar Curso *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value={0}>-- Selecciona un curso --</option>
                  {coursesData.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} - {course.center}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {message && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Creando...' : '🚀 Lanzar Convocatoria'}
                </button>
              </div>
            </form>

            
          </div>

          {/* SECCIÓN DE REGLAS DE FILTRADO */}
            <div className="rules-section">
              <h2>Reglas de Filtrado</h2>
              <p className="rules-description">
                Define qué estudiantes pueden acceder a esta convocatoria según su carrera y año académico.
              </p>

              <div className="rules-container">
                {/* Nuevas reglas de filtrado */}
                {newFilterRules.map((rule, index) => (
                  <div key={`new-filter-${index}`} className="rule-row new-rule">
                    <div className="rule-selects">
                      <div className="select-group">
                        <label className="select-label">Carrera</label>
                        <select 
                          className="form-select"
                          value={rule.majorId || ''}
                          onChange={(e) => handleNewFilterRuleChange(index, 'majorId', e.target.value)}
                        >
                          <option value="">Todas las carreras</option>
                          {majors.map(major => (
                            <option key={major.id} value={major.id}>
                              {major.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="select-group">
                        <label className="select-label">Año Académico</label>
                        <select 
                          className="form-select"
                          value={rule.academicYear || ''}
                          onChange={(e) => handleNewFilterRuleChange(index, 'academicYear', e.target.value)}
                        >
                          <option value="">Todos los años</option>
                          {academicYears
                            .filter(m => m.id !== 0)
                            .map(year => (
                            <option key={year.id} value={year.id}>
                              {year.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      className="btn-delete-rule"
                      onClick={() => removeNewFilterRule(index)}
                    >
                      Eliminar Regla
                    </button>
                  </div>
                ))}

                <div className="rules-actions">
                  <button 
                    type="button"
                    className="btn-add-rule"
                    onClick={addNewFilterRule}
                  >
                    + Añadir Regla de Filtrado
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE REGLAS DE PRIORIDAD */}
            <div className="rules-section priority-rules-container">
              <h2>Reglas de Prioridad</h2>
              <p className="rules-description">
                Define el orden de prioridad para la matrícula de estudiantes. Las reglas se aplicarán en el orden que las agregues (la primera tiene mayor prioridad).
              </p>

              <div className="rules-container">
                {/* Nuevas reglas de prioridad */}
                {newPriorityRules.map((rule, index) => (
                  <div key={`new-priority-${index}`} className="rule-row new-rule">
                    <div className="priority-indicator">
                      <span className="priority-number">#{index + 1}</span>
                    </div>
                    <div className="rule-selects">
                      <div className="select-group">
                        <label className="select-label">Carrera</label>
                        <select 
                          className="form-select"
                          value={rule.majorId || ''}
                          onChange={(e) => handleNewPriorityRuleChange(index, 'majorId', e.target.value)}
                        >
                          <option value="">Todas las carreras</option>
                          {majors.map(major => (
                            <option key={major.id} value={major.id}>
                              {major.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="select-group">
                        <label className="select-label">Año Académico</label>
                        <select 
                          className="form-select"
                          value={rule.academicYear || ''}
                          onChange={(e) => handleNewPriorityRuleChange(index, 'academicYear', e.target.value)}
                        >
                          <option value="">Todos los años</option>
                          {academicYears
                            .filter(m => m.id !== 0)
                            .map(year => (
                            <option key={year.id} value={year.id}>
                              {year.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      className="btn-delete-rule"
                      onClick={() => removeNewPriorityRule(index)}
                    >
                      Eliminar Regla
                    </button>
                  </div>
                ))}

                <div className="rules-actions">
                  <button 
                    type="button"
                    className="btn-add-rule"
                    onClick={addNewPriorityRule}
                  >
                    + Añadir Regla de Prioridad
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};