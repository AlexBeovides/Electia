import "./styles/_main.scss";

import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

import { NavBar } from "./components/NavBar";
import { FooterSection } from "./components/FooterSection";
import { Home } from "./pages/Home";

import { RegisterProfessor } from "./pages/RegisterProfessor";
import { RegisterStudent } from "./pages/RegisterStudent";
import { LogIn } from "./pages/LogIn";
import { UserProfile } from "./pages/UserProfile";

import { SuperAdminMain }  from "./pages/superadmin/SuperAdminMain";

import { FacultiesManager}  from "./pages/admin/FacultiesManager";
import { MajorsManager}  from "./pages/admin/MajorsManager";
import { CentersManager}  from "./pages/admin/CentersManager";
import { ProfessorsManager}  from "./pages/admin/ProfessorsManager";
import { CoursesCatalogAdmin } from "./pages/admin/CoursesCatalogAdmin";
import { CourseInfoAdmin } from "./pages/admin/CourseInfoAdmin";
import { CourseInstancesCatalogAdmin } from "./pages/admin/CourseInstancesCatalogAdmin";
import { CourseInstanceGradesAdmin } from "./pages/admin/CourseInstanceGradesAdmin";
import { CourseInstanceRosterAdmin } from "./pages/admin/CourseInstanceRosterAdmin";
import { LaunchCourseAdmin } from "./pages/admin/LaunchCourseAdmin";
import { CourseInstancesManager } from "./pages/admin/CourseInstancesManager";
import { AdminStatistics } from "./pages/admin/AdminStatistics";

import { CoursesManagerProfessor } from "./pages/professor/CoursesManagerProfessor";
import { CoursesMainPageProfessor } from "./pages/professor/CoursesMainPageProfessor";
import { CoursesCatalogProfessor } from "./pages/professor/CoursesCatalogProfessor";
import { CourseInfoProfessor } from "./pages/professor/CourseInfoProfessor";
import { EditCourseInfoProfessor } from "./pages/professor/EditCourseInfoProfessor";
import { CourseInstancesCatalogProfessor } from "./pages/professor/CourseInstancesCatalogProfessor";
import { CourseInstanceGradesProfessor } from "./pages/professor/CourseInstanceGradesProfessor";
import { CourseInstanceRosterProfessor } from "./pages/professor/CourseInstanceRosterProfessor";

import { CoursesCatalogStudent } from "./pages/student/CoursesCatalogStudent";
import { CourseInfoStudent } from "./pages/student/CourseInfoStudent";
import { MyCoursesStudent } from "./pages/student/MyCoursesStudent";
import { EnrolledCourseInfoStudent } from "./pages/student/EnrolledCourseInfoStudent";
import { EnrolledCourseGradesStudent } from "./pages/student/EnrolledCourseGradesStudent";

function App() {
  const [locked, setLock] = useState(false);

  return (
    <>
      {/* <div className={`${locked ? 'locked' : 'null'} main-container`}> */}
        <div className={`main-page-container`}>
          <NavBar setLock={setLock} />

          <Routes>
            {/* Redirect root path to electia-app */}
            <Route path="/" element={<Navigate to="/electia-app/" replace />} />
            
            <Route path="/electia-app/" element={<Home />}></Route>

            <Route path="/electia-app/register-professor" element={<RegisterProfessor />}></Route>
            <Route path="/electia-app/register-student" element={<RegisterStudent />}></Route>
            <Route path="/electia-app/login" element={<LogIn />}></Route>
            <Route path="/electia-app/profile" element={<UserProfile />}></Route>
            
            <Route path="/electia-app/super-admin/main" element={<SuperAdminMain />}></Route>

            <Route path="/electia-app/faculties-manager" element={<FacultiesManager />}></Route>
            <Route path="/electia-app/majors-manager" element={<MajorsManager />}></Route>
            <Route path="/electia-app/centers-manager" element={<CentersManager />}></Route>
            <Route path="/electia-app/professors-manager" element={<ProfessorsManager />}></Route>
            <Route path="/electia-app/admin/courses-catalog" element={<CoursesCatalogAdmin />}></Route>
            <Route path="/electia-app/admin/courses" element={<CourseInfoAdmin />}></Route>
            <Route path="/electia-app/admin/course-instances-catalog" element={<CourseInstancesCatalogAdmin />}></Route>
            <Route path="/electia-app/admin/course-instance-grades"element={<CourseInstanceGradesAdmin />}></Route>
            <Route path="/electia-app/admin/course-instance-roster" element={<CourseInstanceRosterAdmin />}></Route>
            <Route path="/electia-app/admin/course-instance-statistics" element={<AdminStatistics />}></Route>
            <Route path="/electia-app/admin/launch-course" element={<LaunchCourseAdmin />}></Route>
            <Route path="/electia-app/admin/course-instances-manager" element={<CourseInstancesManager />}></Route>
            

            <Route path="/electia-app/professor/courses-main-page" element={<CoursesMainPageProfessor />}></Route>
            <Route path="/electia-app/professor/courses-manager" element={<CoursesManagerProfessor />}></Route>
            <Route path="/electia-app/professor/courses-catalog" element={<CoursesCatalogProfessor />}></Route>
            <Route path="/electia-app/professor/courses" element={<CourseInfoProfessor />}></Route>
            <Route path="/electia-app/professor/courses/edit" element={<EditCourseInfoProfessor />}></Route>
            <Route path="/electia-app/professor/course-instances-catalog" element={<CourseInstancesCatalogProfessor />}></Route>
            <Route path="/electia-app/professor/course-instance-grades"element={<CourseInstanceGradesProfessor />}></Route>
            <Route path="/electia-app/professor/course-instance-roster" element={<CourseInstanceRosterProfessor />}></Route>
            
            <Route path="/electia-app/courses-catalog" element={<CoursesCatalogStudent />}></Route>
            <Route path="/electia-app/my-courses" element={<MyCoursesStudent />}></Route>
            <Route path="/electia-app/courses" element={<CourseInfoStudent />}></Route>
            <Route path="/electia-app/enrolled-courses" element={<EnrolledCourseInfoStudent />}></Route>
            <Route path="/electia-app/student/enrolled-course-grades" element={<EnrolledCourseGradesStudent />}></Route>
          </Routes>

          <FooterSection />
        </div>
    </>
  );
}


export default App
