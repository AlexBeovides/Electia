import { useState, useEffect } from 'react';
import '../../styles/SuperAdminMain.scss';
import { API_BASE_URL } from "../../config";

interface AdminEmail {
  id: number;
  email: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export const SuperAdminMain = () => {
  const [emails, setEmails] = useState<AdminEmail[]>([]);
  const [newEmail, setNewEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);

  const token: string | null = localStorage.getItem("token");

  // Cargar emails al montar el componente
  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/AdminEmails`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: AdminEmail[] = await response.json();
        setEmails(data);
      } else {
        console.error('Error al cargar emails');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const addEmail = async (): Promise<void> => {
    if (!newEmail.trim() || !isValidEmail(newEmail)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/AdminEmails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        setNewEmail('');
        fetchEmails(); // Recargar la lista
      } else {
        alert('Error al agregar el email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar el email');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmail = async (emailId: number): Promise<void> => {
    if (!confirm('¿Estás seguro de que quieres eliminar este email?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/AdminEmails/${emailId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchEmails(); // Recargar la lista
      } else {
        alert('Error al eliminar el email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el email');
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addEmail();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEmail(e.target.value);
  };

  return (
    <div className="super-admin-main">
      <div className="container">
        <h1 className="title">Admin Emails</h1>
        
        {/* Lista de emails */}
        <div className="emails-section">
          <h2 className="section-title">Emails registrados</h2>
          
          {isLoadingList ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="emails-list">
              {emails.length === 0 ? (
                <p className="no-emails">No hay emails registrados</p>
              ) : (
                emails.map((email: AdminEmail) => (
                  <div key={email.id} className="email-item">
                    <span className="email-text">{email.email}</span>
                    <button
                      onClick={() => deleteEmail(email.id)}
                      className="delete-btn"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Form para agregar nuevo email */}
        <div className="add-email-section">
          <h2 className="section-title">Agregar nuevo email</h2>
          <div className="input-group">
            <input
              type="email"
              value={newEmail}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
              className="email-input"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={addEmail}
              disabled={isLoading}
              className={`add-btn ${isLoading ? 'loading' : ''}`}
              type="button"
            >
              {isLoading ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};