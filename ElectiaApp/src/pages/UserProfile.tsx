import { useState, useEffect } from 'react';
import '../styles/UserProfile.scss';
import { API_BASE_URL } from "../config";

interface UserContactInfo {
  fullName?: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  phoneNumber?: string;
  landline?: string;
  idNumber?: string;
  eveaUsername?: string;
  teacherCategory?: string;
  academicDegree?: string;
  faculty?: string;
  major?: string;
  academicYear?: string;
  role: string;
}

export const UserProfile = () => { 
  const [userInfo, setUserInfo] = useState<UserContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Account/profile`, {
      // const response = await fetch('/api/account/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        setError('Error al cargar la información del perfil');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'student': return 'Estudiante';
      case 'professor': return 'Profesor';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Cargando información del perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="profile-container">
        <div className="error">No se pudo cargar la información del perfil</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{userInfo.fullName?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          <div className="profile-title">
            <h1>{userInfo.fullName || 'Usuario'}</h1>
            <span className="role-badge">{getRoleLabel(userInfo.role)}</span>
          </div>
        </div>

        <div className="profile-content">
          <div className="section">
            <h2>Información de Contacto</h2>
            <div className="info-grid">
              {userInfo.primaryEmail && (
                <div className="info-item">
                  <label>Correo Principal:</label>
                  <span>{userInfo.primaryEmail}</span>
                </div>
              )}
              
              {userInfo.secondaryEmail && (
                <div className="info-item">
                  <label>Correo Secundario:</label>
                  <span>{userInfo.secondaryEmail}</span>
                </div>
              )}
              
              {userInfo.phoneNumber && (
                <div className="info-item">
                  <label>Teléfono Móvil:</label>
                  <span>{userInfo.phoneNumber}</span>
                </div>
              )}
              
              {userInfo.landline && (
                <div className="info-item">
                  <label>Teléfono Fijo:</label>
                  <span>{userInfo.landline}</span>
                </div>
              )}
            </div>
          </div>

          {userInfo.role.toLowerCase() === 'student' && (
            <div className="section">
              <h2>Información Académica</h2>
              <div className="info-grid">
                {userInfo.idNumber && (
                  <div className="info-item">
                    <label>Número de Identidad:</label>
                    <span>{userInfo.idNumber}</span>
                  </div>
                )}
                
                {userInfo.eveaUsername && (
                  <div className="info-item">
                    <label>Usuario EVEA:</label>
                    <span>{userInfo.eveaUsername}</span>
                  </div>
                )}
                
                {userInfo.faculty && (
                  <div className="info-item">
                    <label>Facultad:</label>
                    <span>{userInfo.faculty}</span>
                  </div>
                )}
                
                {userInfo.major && (
                  <div className="info-item">
                    <label>Carrera:</label>
                    <span>{userInfo.major}</span>
                  </div>
                )}
                
                {userInfo.academicYear && (
                  <div className="info-item">
                    <label>Año Académico:</label>
                    <span>{userInfo.academicYear}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {userInfo.role.toLowerCase() === 'professor' && (
            <div className="section">
              <h2>Información Profesional</h2>
              <div className="info-grid">
                {userInfo.teacherCategory && (
                  <div className="info-item">
                    <label>Categoría Docente:</label>
                    <span>{userInfo.teacherCategory}</span>
                  </div>
                )}
                
                {userInfo.academicDegree && (
                  <div className="info-item">
                    <label>Grado Académico:</label>
                    <span>{userInfo.academicDegree}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;