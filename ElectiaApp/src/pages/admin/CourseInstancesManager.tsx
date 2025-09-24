import "@styles/CourseInstanceManager.scss"; 
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import { Option } from '../../types';

type Course = {
    id: number;
    name: string;
};

type CourseInstanceData = {
    id: number;
    courseId: number;
    startDate: string;
    endDate: string;
    course: Course;
};

type FormData = {
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

export const CourseInstancesManager = () => {
  const [courseData, setCourseData] = useState<Course>();
  const [courseInstanceData, setCourseInstanceData] = useState<CourseInstanceData>();
  const [majors, setMajors] = useState<Option[]>([]);
  const [academicYears, setAcademicYears] = useState<Option[]>([]);
  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    endDate: ''
  });
  const [acceptedStudentsCount, setAcceptedStudentsCount] = useState(0);

  
  // Reglas de filtrado (sin prioridad)
  const [filterRules, setFilterRules] = useState<Rule[]>([]);
  const [newFilterRules, setNewFilterRules] = useState<RuleFormData[]>([]);
  const [isLoadingFilterRules, setIsLoadingFilterRules] = useState(false);
  const [filterRulesMessage, setFilterRulesMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Reglas de prioridad (con prioridad)
  const [priorityRules, setPriorityRules] = useState<Rule[]>([]);
  const [newPriorityRules, setNewPriorityRules] = useState<RuleFormData[]>([]);
  const [isLoadingPriorityRules, setIsLoadingPriorityRules] = useState(false);
  const [priorityRulesMessage, setPriorityRulesMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const courseInstanceId = urlParams.get('courseId');
  const token = localStorage.getItem("token");

  // Función para convertir fecha ISO a formato YYYY-MM-DD
  const formatDateForInput = (isoDate: string) => {
    return new Date(isoDate).toISOString().split('T')[0];
  };

  // ========== FUNCIONES PARA REGLAS DE FILTRADO ==========
  
  // Función para manejar cambios en las nuevas reglas de filtrado
  const handleNewFilterRuleChange = (index: number, field: 'majorId' | 'academicYear', value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setNewFilterRules(prev => prev.map((rule, i) => 
      i === index ? { ...rule, [field]: numValue } : rule
    ));
  };

  // Función para añadir nueva regla de filtrado
  const addNewFilterRule = () => {
    setNewFilterRules(prev => [...prev, { majorId: null, academicYear: null }]);
  };

  // Función para eliminar nueva regla de filtrado (antes de guardar)
  const removeNewFilterRule = (index: number) => {
    setNewFilterRules(prev => prev.filter((_, i) => i !== index));
  };

  // Función para eliminar regla de filtrado existente
  const removeExistingFilterRule = async (ruleId: number) => {
    try {
      await fetch(`${API_BASE_URL}/Rules/${ruleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setFilterRules(prev => prev.filter(rule => rule.id !== ruleId));
      setFilterRulesMessage({type: 'success', text: 'Regla de filtrado eliminada correctamente'});
    } catch (error) {
      console.error('Delete filter rule error:', error);
      setFilterRulesMessage({type: 'error', text: 'Error al eliminar la regla de filtrado'});
    }
  };

  // Función para guardar las reglas de filtrado
  const saveFilterRules = async () => {
    setIsLoadingFilterRules(true);
    setFilterRulesMessage(null);

    try {
      const rulesToCreate = newFilterRules.filter(rule => rule.majorId !== null || rule.academicYear !== null);
      
      for (const rule of rulesToCreate) {
        await fetch(`${API_BASE_URL}/Rules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseInstanceId: parseInt(courseInstanceId!),
            majorId: rule.majorId,
            academicYear: rule.academicYear,
            priority: null, // Sin prioridad para reglas de filtrado
            isDeleted: false
          }),
        });
      }

      // Recargar reglas
      await fetchRules();
      setNewFilterRules([]);
      setFilterRulesMessage({type: 'success', text: 'Reglas de filtrado guardadas correctamente'});
    } catch (error) {
      console.error('Save filter rules error:', error);
      setFilterRulesMessage({type: 'error', text: 'Error al guardar las reglas de filtrado'});
    } finally {
      setIsLoadingFilterRules(false);
    }
  };

  // ========== FUNCIONES PARA REGLAS DE PRIORIDAD ==========
  
  // Función para manejar cambios en las nuevas reglas de prioridad
  const handleNewPriorityRuleChange = (index: number, field: 'majorId' | 'academicYear', value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setNewPriorityRules(prev => prev.map((rule, i) => 
      i === index ? { ...rule, [field]: numValue } : rule
    ));
  };

  // Función para añadir nueva regla de prioridad
  const addNewPriorityRule = () => {
    setNewPriorityRules(prev => [...prev, { majorId: null, academicYear: null }]);
  };

  // Función para eliminar nueva regla de prioridad (antes de guardar)
  const removeNewPriorityRule = (index: number) => {
    setNewPriorityRules(prev => prev.filter((_, i) => i !== index));
  };

  // Función para eliminar regla de prioridad existente
  const removeExistingPriorityRule = async (ruleId: number) => {
    try {
      await fetch(`${API_BASE_URL}/Rules/${ruleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setPriorityRules(prev => prev.filter(rule => rule.id !== ruleId));
      setPriorityRulesMessage({type: 'success', text: 'Regla de prioridad eliminada correctamente'});
    } catch (error) {
      console.error('Delete priority rule error:', error);
      setPriorityRulesMessage({type: 'error', text: 'Error al eliminar la regla de prioridad'});
    }
  };

  // Función para guardar las reglas de prioridad
  const savePriorityRules = async () => {
    setIsLoadingPriorityRules(true);
    setPriorityRulesMessage(null);

    try {
      const rulesToCreate = newPriorityRules.filter(rule => rule.majorId !== null || rule.academicYear !== null);
      
      // Obtener la prioridad más alta actual para continuar la secuencia
      const maxCurrentPriority = priorityRules.length > 0 
        ? Math.max(...priorityRules.map(r => r.priority || 0))
        : 0;
      
      for (let i = 0; i < rulesToCreate.length; i++) {
        const rule = rulesToCreate[i];
        await fetch(`${API_BASE_URL}/Rules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseInstanceId: parseInt(courseInstanceId!),
            majorId: rule.majorId,
            academicYear: rule.academicYear,
            priority: maxCurrentPriority + i + 1, // Asignar prioridad basada en el orden
            isDeleted: false
          }),
        });
      }

      // Recargar reglas
      await fetchRules();
      setNewPriorityRules([]);
      setPriorityRulesMessage({type: 'success', text: 'Reglas de prioridad guardadas correctamente'});
    } catch (error) {
      console.error('Save priority rules error:', error);
      setPriorityRulesMessage({type: 'error', text: 'Error al guardar las reglas de prioridad'});
    } finally {
      setIsLoadingPriorityRules(false);
    }
  };

  // Función para cargar reglas existentes
  const fetchRules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Rules/ByCourseInstance/${courseInstanceId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (response.ok) {
        const rulesData = await response.json();
        
        // Separar reglas de filtrado (sin prioridad) y reglas de prioridad (con prioridad)
        const filterRulesData = rulesData.filter((rule: Rule) => rule.priority === null || rule.priority === undefined);
        const priorityRulesData = rulesData.filter((rule: Rule) => rule.priority !== null && rule.priority !== undefined);
        
        // Ordenar reglas de prioridad por su valor de prioridad
        priorityRulesData.sort((a: Rule, b: Rule) => (a.priority || 0) - (b.priority || 0));
        
        setFilterRules(filterRulesData);
        setPriorityRules(priorityRulesData);
      }
    } catch (error) {
      console.error('Fetch rules error:', error);
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/CourseInstances/${courseInstanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
        },
        body: JSON.stringify({
          id: courseInstanceData?.id,
          courseId: courseInstanceData?.courseId,
          startDate: formData.startDate,
          endDate: formData.endDate
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar la instancia del curso');

      setMessage({type: 'success', text: 'Fechas actualizadas correctamente'});
    } catch (error) {
      console.error('Update error:', error);
      setMessage({type: 'error', text: 'Error al actualizar las fechas'});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Majors`).then((res) => setMajors(res.data));
    axios.get(`${API_BASE_URL}/Students/academic-years`).then((res) => setAcademicYears(res.data)); 
  }, []);

  useEffect(() => {
    const fetchCourseInstanceData = async () => {
      try {
        // Obtener datos completos de CourseInstance
        const instanceResponse = await fetch(`${API_BASE_URL}/CourseInstances/${courseInstanceId}`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });

        if (!instanceResponse.ok) throw new Error('Error al obtener CourseInstance');

        const instanceData: CourseInstanceData = await instanceResponse.json();
        setCourseInstanceData(instanceData);

        // Establecer los datos del formulario con las fechas actuales
        setFormData({
          startDate: formatDateForInput(instanceData.startDate),
          endDate: formatDateForInput(instanceData.endDate)
        });

        // Obtener detalles del curso usando courseId
        const courseResponse = await fetch(`${API_BASE_URL}/Courses/ForCatalog/${instanceData.courseId}`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });

        if (!courseResponse.ok) throw new Error('Error al obtener Course');

        const courseRaw = await courseResponse.json();

        const course: Course = {
          id: courseRaw.id,
          name: courseRaw.title,
        };
        
        setCourseData(course);
      } catch (error) {
        console.error('Fetch error:', error);
        setMessage({type: 'error', text: 'Error al cargar los datos del curso'});
      }
    };  
    
    if (courseInstanceId) {
      fetchCourseInstanceData();
      fetchRules();
    }
  }, [courseInstanceId]);

  const fetchCourseGrades = async () => {
        try {
            // Extraer el courseId de los parámetros de la URL
            if (!courseInstanceId) {
                throw new Error('No se encontró el courseId en la URL');
            }

            const response = await fetch(`${API_BASE_URL}/CourseGrades/ByCourse/${courseInstanceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                },
            });

            if (!response.ok) {
                throw new Error(`Error al obtener las calificaciones: ${response.status}`);
            }

            const data = await response.json();
            // Guardar la cantidad de estudiantes aceptados
            setAcceptedStudentsCount(data.length || 0);
           
        } catch (error) {
            console.error('Error fetching course grades:', error);
            setAcceptedStudentsCount(0); 
        }
    };

    useEffect(() => {
        fetchCourseGrades();
    }, []);

  const genRoster = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/CourseGrades/generate-enrollment/${courseInstanceId}`, {
      method: 'POST',  
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      alert('Error: No se pudo generar la matricula. Por favor, intenta nuevamente.');
      throw new Error('Error generating roster');
    }
    
    const result = await response.json();
    alert('Matricula generada exitosamente!');
    return result;
    
  } catch (error) {
    alert('Error: Ocurrió un problema al generar la matricula. Verifica tu conexión e intenta nuevamente.');
    throw error;
  }
};

// Función para eliminar convocatoria
const handleDeleteCourse = async () => {
  const confirmDelete = window.confirm(
    `¿Está seguro que desea eliminar esta convocatoria "${courseData?.name}"?\n\nEsta acción no se puede deshacer.`
  );
  
  if (confirmDelete) {
    try {
      const response = await fetch(`${API_BASE_URL}/CourseInstances/${courseInstanceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la convocatoria');
      }
      
      alert('Convocatoria eliminada exitosamente');
      // Redirigir a la página principal o lista de convocatorias
      window.location.href = `${window.location.origin}/electia-app/admin/course-instances-catalog`;
      
    } catch (error) {
      console.error('Delete course instance error:', error);
      alert('Error al eliminar la convocatoria. Por favor, intente nuevamente.');
    }
  }
};

  return (
    <>
      <div className="course-instances-manager-container">
        <div className="course-instances-section">
          <div className="intro-text">
            <h1>
              <span>{courseData?.name}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
                className="delete-course-icon"
                onClick={handleDeleteCourse}
                aria-label="Eliminar convocatoria"
              >
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
              </svg>
            </h1>

            <p>
              En este panel puedes editar la información de la convocatoria {courseData?.name}, administrador.
            </p>
            
            <div className="navigation-links">
              <a href={`${window.location.origin}/electia-app/admin/courses/?courseId=${courseData?.id}`}>
                ➡️ Información del Curso
              </a>
              <a href={`${window.location.origin}/electia-app/admin/course-instance-roster/?courseId=${courseInstanceId}`}>
                ➡️ Matrícula del Curso
              </a>
              <a href={`${window.location.origin}/electia-app/admin/course-instance-grades/?courseId=${courseInstanceId}`}>
                ➡️ Notas del Curso
              </a>
              <a href={`${window.location.origin}/electia-app/admin/course-instance-statistics/?courseId=${courseInstanceId}`}>
                ➡️ Estadísticas del Curso
              </a>
            </div> 
          </div>

          {acceptedStudentsCount === 0 && (
            <button 
                type="button"
                className="btn-generate-roster"
                onClick={genRoster}
                disabled={isLoadingPriorityRules}
            >
            GENERAR MATRICULA
            </button>
          )}

          <div className="course-instance-form-container">
            <h2>Editar Fechas de la Convocatoria</h2>
            
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="course-instance-form">
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

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
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
            
            {filterRulesMessage && (
              <div className={`message ${filterRulesMessage.type}`}>
                {filterRulesMessage.text}
              </div>
            )}

            <div className="rules-container">
              {/* Reglas de filtrado existentes */}
              {filterRules.map((rule) => (
                <div key={rule.id} className="rule-row existing-rule">
                  <div className="rule-selects">
                    <div className="select-group">
                      <label className="select-label">Carrera</label>
                      <select 
                        className="form-select" 
                        value={rule.majorId || ''} 
                        disabled
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
                        disabled
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
                    onClick={() => removeExistingFilterRule(rule.id!)}
                  >
                    Eliminar Regla
                  </button>
                </div>
              ))}

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
                
                {newFilterRules.length > 0 && (
                  <button 
                    type="button"
                    className="btn-save-rules"
                    onClick={saveFilterRules}
                    disabled={isLoadingFilterRules}
                  >
                    {isLoadingFilterRules ? 'Guardando...' : 'Guardar Reglas de Filtrado'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN DE REGLAS DE PRIORIDAD */}
          <div className="rules-section">
            <h2>Reglas de Prioridad</h2>
            <p className="rules-description">
              Define el orden de prioridad para la matrícula de estudiantes. Las reglas se aplicarán en el orden que las agregues (la primera tiene mayor prioridad).
            </p>
            
            {priorityRulesMessage && (
              <div className={`message ${priorityRulesMessage.type}`}>
                {priorityRulesMessage.text}
              </div>
            )}

            <div className="rules-container">
              {/* Reglas de prioridad existentes */}
              {priorityRules.map((rule, index) => (
                <div key={rule.id} className="rule-row existing-rule">
                  <div className="priority-indicator">
                    <span className="priority-number">#{index + 1}</span>
                  </div>
                  <div className="rule-selects">
                    <div className="select-group">
                      <label className="select-label">Carrera</label>
                      <select 
                        className="form-select" 
                        value={rule.majorId || ''} 
                        disabled
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
                        disabled
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
                    onClick={() => removeExistingPriorityRule(rule.id!)}
                  >
                    Eliminar Regla
                  </button>
                </div>
              ))}

              {/* Nuevas reglas de prioridad */}
              {newPriorityRules.map((rule, index) => (
                <div key={`new-priority-${index}`} className="rule-row new-rule">
                  <div className="priority-indicator">
                    <span className="priority-number">#{priorityRules.length + index + 1}</span>
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
                
                {newPriorityRules.length > 0 && (
                  <button 
                    type="button"
                    className="btn-save-rules"
                    onClick={savePriorityRules}
                    disabled={isLoadingPriorityRules}
                  >
                    {isLoadingPriorityRules ? 'Guardando...' : 'Guardar Reglas de Prioridad'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

 