import { useState, useContext, ChangeEvent, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Register.scss";
import { AuthContext } from "../AuthContext";
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface FormValues { 
  email: string;
  password: string;
}

interface FormErrors {
  server?: string;
  email?: string;
  password?: string;
}

export const LogIn = () => {
  const { setToken,setUserRole } = useContext(AuthContext);

  const initialValues: FormValues = { 
    email: "",
    password: ""
  };
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/Account/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });

        let data;
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }

        if (response.ok) {
          if(data.token!=""){
            console.log('Logged in successfully', data);
            localStorage.setItem('token', data.token); 
            localStorage.setItem('user_role', data.role); 
            localStorage.setItem('user_airport_id', data.airportId); 
            console.log(data);
            setToken(data.token);
            setUserRole(data.role);
            console.log(data.role);
            if(data.role == 'SuperAdmin'){
              
            }
            else{
              navigate('/electia-app/');
            }
          } else {
            console.log('Login failed', data);
            setFormErrors({ server: "Unable to log in. Please try again later." });
          }
        } else if (response.status === 401) {
          console.log('Request failed', data);
          setFormErrors({ server: "Something went wrong." });
        } else {
          console.log('Request failed', data);
          setFormErrors({ server: Object.values(data).join(' ') });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } 
    return errors;
  };

  return (
    <div className="reg-page">
      <div className="reg-container">
        {isLoading ? (
          <div>Cargando...</div> // Replace this with your actual loading spinner
        ) : (
          <div className="reg-form-container">
            <form onSubmit={handleSubmit}>
              <h1>Iniciar Sesión</h1>
              <div className="ui divider"></div>
              {formErrors.server && <div className="ui message error">{formErrors.server}</div>}
              <div className="ui form">
                <div className="field">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <p>{formErrors.email}</p>
                <div className="field">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                </div>
                <p>{formErrors.password}</p>
                <button className="fluid ui button blue">Enviar</button>
              </div>
            </form>
            <div className="text">
              No tienes una cuenta? <Link to="/electia-app/register-professor"><span>Registrarse</span></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}