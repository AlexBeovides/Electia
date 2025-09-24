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
  teacherCategory: number;
  academicDegree: number;
  landline: string;
  phoneNumber: string;
  secondaryEmail: string;
}

interface FormErrors {
    server?:string;

    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    teacherCategory?: string;
    academicDegree?: string;
    landline?: string;
    phoneNumber?: string;
    secondaryEmail?: string;
}

export const RegisterProfessor = () =>{
    const initialValues: FormValues = { 
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        teacherCategory: 0,
        academicDegree: 0,
        landline: "",
        phoneNumber: "",
        secondaryEmail: ""
    };
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    // const { setToken,setUserRole } = useContext(AuthContext);

    const [teacherCategories, setTeacherCategories] = useState<Option[]>([]);
    const [academicDegrees, setAcademicDegrees] = useState<Option[]>([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/Professors/teacher-categories`).then((res) => setTeacherCategories(res.data));
        axios.get(`${API_BASE_URL}/Professors/academic-degrees`).then((res) => setAcademicDegrees(res.data)); 
      }, []);

    const navigate = useNavigate();
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
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
                formData.append("TeacherCategory", formValues.teacherCategory.toString()); 
                formData.append("AcademicDegree", formValues.academicDegree.toString()); 
                formData.append("Landline", formValues.landline); 
                formData.append("PhoneNumber", formValues.phoneNumber); 
                formData.append("SecondaryEmail", formValues.secondaryEmail); 

                const response = await fetch(`${API_BASE_URL}/Account/register-professor`, {
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
                    // localStorage.setItem('token', data.token); 
                    // localStorage.setItem('user_role', data.role); 
                    // setToken(data.token);
                    // setUserRole(data.role);
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
        if (!values.phoneNumber) {
            errors.phoneNumber = "Phone Number is required!";
        }
        if (!values.teacherCategory) {
            errors.teacherCategory = "Teacher Category is required!";
        }
        if (!values.academicDegree) {
            errors.academicDegree = "Academic Degree is required!";
        }
        return errors;
      };

    return (
        <> 
            <div className="reg-page">
                <div className="reg-container">
                    {isLoading ? (
                        <div load-container>Cargando...</div>
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
                                            placeholder="Confirmar Contraseña"
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
                                        <label>Categoría de Profesor <span style={{ color: "red" }}>*</span></label>

                                        <select name="teacherCategory" value={formValues.teacherCategory || ""} onChange={handleChange} required>
                                            <option value="" disabled>Seleccione su Categoría Docente</option>
                                            {teacherCategories.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p>{formErrors.teacherCategory}</p>
                                    
                                    <div className="field">
                                        <label>Grado Académico <span style={{ color: "red" }}>*</span></label>

                                        <select name="academicDegree" value={formValues.academicDegree || ""} onChange={handleChange} required>
                                            <option value="" disabled>Seleccione su Grado Científico</option>
                                            {academicDegrees.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p>{formErrors.academicDegree}</p>

                                    <div className="field">
                                        <label>Teléfono Fijo </label>
                                        <input
                                            type="text"
                                            name="landline"
                                            placeholder="Escriba su número de teléfono fijo aquí..."
                                            value={formValues.landline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <p>{formErrors.landline}</p>

                                    <div className="field">
                                        <label>Número de Celular <span style={{ color: "red" }}>*</span> </label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Escriba su número de celular aquí..."
                                            value={formValues.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <p>{formErrors.phoneNumber}</p>

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
                                ¿Eres un estudiante? <Link to="/electia-app/register-student"><span>Registrarse</span></Link>
                            </div>
                        </div>
                    )}
                </div>
                {" "}
            </div>
        </>
    );
}
 