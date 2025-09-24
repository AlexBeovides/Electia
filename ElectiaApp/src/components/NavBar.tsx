import "../styles/NavBar.scss";
import { API_BASE_URL } from "../config";
import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // Replace '../AuthContext' with the actual path to your AuthContext file

export function NavBar({ setLock }: { setLock: any }) {
  const [clicked, setClicked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [greeting, setGreeting] = useState("hola usuario");
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (clicked) {
    document.body.classList.add("locked");
  } else {
    document.body.classList.remove("locked");
  }

  const { token, setToken, userRole, setUserRole } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserRole("");
    navigate("/electia-app/");
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/electia-app/profile"); // Ajusta esta ruta según tu aplicación
    setDropdownOpen(false);
  };

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 useEffect(() => { 
    const fetchUserProfile = async () => {
      // Only fetch user profile if we have a valid token
      const storedToken = localStorage.getItem("token");
      if (!storedToken || !token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/Account/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          // If unauthorized, clear the token as it might be expired
          if (response.status === 401) {
            console.warn("Token expired or invalid, logging out...");
            handleLogout();
            return;
          }
          console.error("Error al obtener el perfil del usuario:", response.status);
          return;
        }

        const data = await response.json();
        const fullName = data.fullName;

        if (fullName && fullName.trim() !== "") {
          const firstName = fullName.split(" ")[0].toLowerCase(); // Obtén el primer nombre
          setGreeting(`hola ${firstName}`);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };

    fetchUserProfile();
  }, [token]); // Add token as dependency 

  return (
    <div className={`main-navbar ${clicked ? "clicked" : "non-clicked"}`}>
      <div className="wrapper">
        <Link to="/electia-app/" target="blank" className="logo-container">
          elect.io
        </Link>
        <div className="nav-links">
          
          {token && userRole === "Professor" &&(
            <Link to="/electia-app/professor/courses-main-page" target="blank">
              cursos
            </Link>
          )} 

          {token && userRole === "Student" && (
            <Link to="/electia-app/courses-catalog" target="blank">
              catálogo
            </Link>
          )}

          {token && userRole === "Student" && (
            <Link to="/electia-app/my-courses" target="blank">
              mis cursos
            </Link>
          )}

          {token && userRole === "Admin" && (
            <Link to="/electia-app/admin/courses-catalog" target="blank">
              cursos
            </Link>
          )} 

          {token && userRole === "Admin" && (
            <Link to="/electia-app/faculties-manager" target="blank">
              facultades
            </Link>
          )}  

          {token && userRole === "Admin" && (
            <Link to="/electia-app/centers-manager" target="blank">
              centros
            </Link>
          )}  

          {token && userRole === "Admin" && (
            <Link to="/electia-app/majors-manager" target="blank">
              carreras
            </Link>
          )}  

          {token && userRole === "Admin" && (
            <Link to="/electia-app/professors-manager" target="blank">
              profesores
            </Link>
          )}  

          {token && userRole === "SuperAdmin" && (
            <Link to="/electia-app/super-admin/main" target="blank">
              admins
            </Link>
          )}  

          {token ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <div 
                className="user-greeting"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {greeting}
              </div>
              <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                <div className="dropdown-item" onClick={handleProfileClick}>
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 96l576 0c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96zm0 32L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-288L0 128zM64 405.3c0-29.5 23.9-53.3 53.3-53.3l117.3 0c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7L74.7 416c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/>
                  </svg>
                  mi perfil
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
                  </svg>
                  cerrar sesión
                </div>
              </div>
            </div>
          ) : (
            <Link to="/electia-app/login" target="blank">
              iniciar sesión
            </Link>
          )}
        </div>

        <div
          className="hamburger"
          onClick={() => {
            setClicked(!clicked);
            setLock(!clicked);
          }}
        >
          <div className="top"></div>
          <div className="middle"></div>
          <div className="bottom"></div>
        </div>
      </div>
    </div>
  );
}