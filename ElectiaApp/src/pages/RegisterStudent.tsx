import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Register.scss";
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import axios from "axios";
import { Option } from '../types';

interface FormValues { 
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  idNumber: string;
  eveaUsername: string;
  phoneNumber: string;
  facultyId: number;
  majorId: number;
  secondaryEmail: string;
}

interface FormErrors {
    server?: string;

    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    idNumber?: string;
    eveaUsername?: string;
    phoneNumber?: string;
    facultyId?: string;
    majorId?: string;
    secondaryEmail?: string;
}

export const RegisterStudent = () =>{
    const initialValues: FormValues = { 
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        idNumber: "",
        eveaUsername: "",
        phoneNumber: "",
        facultyId: 0,
        majorId: 0,
        secondaryEmail: ""
    };
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false); 

    const [faculties, setFaculties] = useState<Option[]>([]);
    const [majors, setMajors] = useState<Option[]>([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/Faculties`).then((res) => setFaculties(res.data));
        axios.get(`${API_BASE_URL}/Majors`).then((res) => setMajors(res.data)); 
    }, []);

    const navigate = useNavigate();
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const formData = new FormData();

            formData.append("Email", formValues.email); 
            formData.append("Password", formValues.password); 
            formData.append("FullName", formValues.fullName); 
            formData.append("IdNumber", formValues.idNumber); 
            formData.append("EveaUsername", formValues.eveaUsername); 
            formData.append("PhoneNumber", formValues.phoneNumber); 
            formData.append("FacultyId", formValues.facultyId.toString()); 
            formData.append("MajorId", formValues.majorId.toString()); 
            formData.append("SecondaryEmail", formValues.secondaryEmail); 

            const response = await fetch(`${API_BASE_URL}/Account/register-student`, {
                method: 'POST',
                headers: {
                    
                },
                body: formData
            });
    
            let data;
            const text = await response.text();
            if (text) {
            data = JSON.parse(text);
            }
    
            if (response.ok) {
                console.log('Signed up successfully', data);
                navigate('/electia-app/');
            } else {
                console.log('Request failed', data);
                setFormErrors({ server: data });
            }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
      };
  
    useEffect(() => {
      console.log(formErrors);
      if (Object.keys(formErrors).length === 0) {
        console.log(formValues);
      }
    }, [formErrors, formValues]);

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
        } else if (values.password.length < 4) {
          errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
          errors.password = "Password cannot exceed more than 10 characters";
        }
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = "Those passwords didn’t match. Try again.";
        }
        if (!values.fullName) {
            errors.fullName = "Full Name is required!";
        }
        if (!values.idNumber) {
            errors.idNumber = "ID Number is required!";
        }
        if (!values.eveaUsername) {
            errors.eveaUsername = "EVEA Username is required!";
        }
        if (!values.phoneNumber) {
            errors.phoneNumber = "Phone Number is required!";
        }
        if (!values.facultyId) {
            errors.facultyId = "Faculty is required!";
        }
        if (!values.majorId) {
            errors.majorId = "Major is required!";
        }
        return errors;
      };

    return (
        <> 
            <div className="reg-page">
                <div className="reg-container">
                    {isLoading ? (
                        <div load-container>Cargando...</div> // Reemplaza esto con tu spinner de carga real
                    ) : (
                    <div className="reg-form-container">
                        <form onSubmit={handleSubmit}>
                            <h1>Registrarse</h1>
                            <div className="ui divider"></div>
                            {formErrors.server && <div className="ui message error">{formErrors.server}</div>}
                            <div className="ui form">
                                <div className="field">
                                    <label>Correo electrónico</label>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Correo electrónico"
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

                                <div className="field">
                                    <label>Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirmar contraseña"
                                        value={formValues.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p>{formErrors.confirmPassword}</p>

                                <div className="field">
                                    <label>Nombre Completo <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Escriba su nombre completo aquí..."
                                        value={formValues.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p>{formErrors.fullName}</p>

                                <div className="field">
                                    <label>Carnet de Identidad <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="idNumber"
                                        placeholder="Escriba su carnet de identidad aquí..."
                                        value={formValues.idNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p>{formErrors.idNumber}</p>

                                <div className="field">
                                    <label>Nombre de Usuario EVEA <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="eveaUsername"
                                        placeholder="Escriba su nombre de usuario EVEA aquí..."
                                        value={formValues.eveaUsername}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p>{formErrors.eveaUsername}</p>

                                <div className="field">
                                    <label>Número de Teléfono <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Escriba su número de teléfono aquí..."
                                        value={formValues.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p>{formErrors.phoneNumber}</p>

                                <div className="field">
                                    <label>Facultad <span style={{ color: "red" }}>*</span></label>
                                    <select name="facultyId" value={formValues.facultyId || ""} onChange={handleChange} required>
                                        <option value="" disabled>Seleccione su Facultad</option>
                                        {faculties.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <p>{formErrors.facultyId}</p>

                                <div className="field">
                                    <label>Carrera <span style={{ color: "red" }}>*</span></label>
                                    <select name="majorId" value={formValues.majorId || ""} onChange={handleChange} required>
                                        <option value="" disabled>Seleccione su Carrera</option>
                                        {majors.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <p>{formErrors.majorId}</p>

                                <div className="field">
                                    <label>Correo Electrónico Secundario</label>
                                    <input
                                        type="email"
                                        name="secondaryEmail"
                                        placeholder="Escriba su correo electrónico secundario aquí..."
                                        value={formValues.secondaryEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p>{formErrors.secondaryEmail}</p>

                                <button className="fluid ui button blue">Enviar</button>
                                </div>
                        </form>
                        <div className="text">
                            ¿Ya tienes cuenta? <Link to="/electia-app/login"><span>Iniciar sesión</span></Link>
                        </div>
                        <div className="text">
                            ¿Eres un profesor? <Link to="/electia-app/register-professor"><span>Registrarse</span></Link>
                        </div>
                    </div>
                    )}
                </div>
                {" "}
            </div>
        </>
    );
}