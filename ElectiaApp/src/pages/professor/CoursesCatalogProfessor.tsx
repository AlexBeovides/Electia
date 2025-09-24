import "@styles/CoursesCatalog.scss";
import { CourseCardProfessor } from "../../components/CourseCardProfessor";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";

type Course = {
  id: number;
  title: string;
  center: string;
  modality: string;
  imgUrl: string;
};

export const CoursesCatalogProfessor = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/Courses/FromProfessor`, {
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
            }));

        setCoursesData(mappedCourses);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

   
  return (
    <>
      <div className="courses-catalog-page-container">
        <div className="courses-section">
          <div className="intro-text">
            <h1>
              <span>Mis Cursos</span>
            </h1>
            
            <p>
              {" "}
              Bienvenido al Catálogo de Cursos Electivos, profesor. En esta sección encontrará todos los cursos que usted ha propuesto para
              impartir en el sistema de electivas de la Universidad de La Habana. Aquí puede visualizar y gestionar la información completa 
              de cada asignatura, incluyendo fundamentación, objetivos, temario, bibliografía y sistema de evaluación. Para modificar los 
              detalles de cualquier curso, simplemente haga clic sobre su título y accederá a la interfaz de edición. Recuerde que mantener 
              actualizada esta información es fundamental para que los estudiantes puedan tomar decisiones informadas sobre su matrícula.
              {" "}
            </p>
          </div>

          {coursesData.length === 0 ? (
                <h4 style={{ marginLeft: "100px"}}>(Usted no cuenta con cursos.)</h4>
          ) : (
          <div className="courses-container">
            {coursesData.map(
              (course, index) =>(
                  <CourseCardProfessor
                    key={index}
                    name={course.title}
                    center={course.center}
                    url={course.imgUrl}
                    id={course.id}
                  />
                )
            )}
          </div>
          )}
        </div>
      </div>
    </>
  );
};