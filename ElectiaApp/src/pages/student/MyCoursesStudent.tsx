import "@styles/CoursesCatalog.scss";
import { EnrolledCourseCard } from "../../components/EnrolledCourseCard";
import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";

type Course = {
  id: number;
  title: string;
  center: string;
  modality: string;
  imgUrl: string;
};


export const MyCoursesStudent = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/CourseInstances/ForCatalog/Enrolled`, {
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
              <span>Mis Cursos Electivos</span>
            </h1>
            
            <p>
              {" "}
              Bienvenido a tu espacio personal de cursos electivos. En esta sección podrás visualizar y gestionar todas las asignaturas electivas en las que te has inscrito durante tu formación académica en la Universidad de La Habana.
              {" "}
            </p>
          </div>

          {coursesData.length === 0 ? (
            <h4 style={{ marginLeft: "100px"}}>(Usted no se encuentra cursando ninguna asignatura electiva.)</h4>
          ) : (
            <div className="courses-container">
              {coursesData.map(
                (course, index) =>(
                    <EnrolledCourseCard
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

         