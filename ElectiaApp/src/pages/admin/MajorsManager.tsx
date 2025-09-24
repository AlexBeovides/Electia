import '../../styles/Manager.scss';
import { API_BASE_URL } from '../../config';
import { AG_GRID_LOCALE_ES } from '../../types/agGridLocaleEs';
import { useEffect, useState, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, RowSelectionOptions } from 'ag-grid-community';
import { Option } from '../../types';
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  id: number;
  name: string;
  facultyName: string;
}

type Major = {
  name: string;
  facultyId: number;
};

export const MajorsManager = () => {
  const [newMajor, setNewMajor] = useState<Major>({ name: '', facultyId: 0});
  const [rowData, setRowData] = useState<IRow[]>([]);
  const [faculties, setFaculties] = useState<Option[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Faculties`).then((res) => setFaculties(res.data)); 
  }, []);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    filter: true,
  }), []);

  const colDefs: ColDef<IRow>[] = useMemo(() => [ 
    { field: 'name', headerName: 'Nombre', editable: true}, // 'name' is editable by defaultColDef
    { field: 'facultyName', headerName: 'Facultad' }, // 'name' is editable by defaultColDef
  ], []);

  const rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: false,
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_BASE_URL}/Majors`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Response:', data);

        // Map the data to include facultyName instead of facultyId
        const mappedData = data.map((major: any) => {
          const faculty = faculties.find(f => f.id === major.facultyId);
          return {
            id: major.id,
            name: major.name,
            facultyName: faculty ? faculty.name : '???', // Default to 'Desconocido' if no match is found
          };
        });

        setRowData(mappedData);
      })
      .catch((error) => console.error('Error:', error));
  }, [faculties]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    fetch(`${API_BASE_URL}/Majors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMajor),
    })
      .then((response) => response.json())
      .then((data) => {
        setRowData((prevData) => [...prevData, data]);
        setNewMajor({ 
          name: '',
          facultyId: 0 
        }); // Reset form
      })
      .catch((error) => console.error('Error:', error));
  };

  const onCellValueChanged = (params: any) => {
    const updatedData = params.data;

    fetch(`${API_BASE_URL}/Majors/${updatedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Update successful:', data);
      })
      .catch((error) => {
        console.error('Error updating major:', error);
      });
  };

  const gridRef = useRef<AgGridReactType<IRow>>(null);

  const deleteSelectedRows = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
  
    if (selectedRows.length === 0) {
      alert('Por favor, selecciona al menos una fila para eliminar.');
      return;
    }
  
    const selectedIds = selectedRows.map(row => row.id);
  
    Promise.all(
      selectedIds.map(id =>
        fetch(`${API_BASE_URL}/Majors/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    )
      .then(responses => {
        const allSuccessful = responses.every(response => response.ok);
        if (allSuccessful) {
          setRowData(prevData => prevData.filter(row => !selectedIds.includes(row.id)));
          alert('Facultades eliminadas exitosamente.');
        } else {
          alert('Ocurrió un error al eliminar algunas facultades.');
        }
      })
      .catch(error => {
        console.error('Error al eliminar facultades:', error);
        alert('Ocurrió un error al eliminar las facultades.');
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewMajor({ ...newMajor, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="manager-page-container"> 
        <h2 className="page-header">Carreras:</h2>
        <div className="section-container">
          <div className="table-container">
            <div className="manager-table" style={{ height: 400, width: 800 }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection={rowSelection}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 25, 50]}
                onCellValueChanged={onCellValueChanged}
                localeText={AG_GRID_LOCALE_ES}
              />
            </div>

            <button
              className="my-button delete-button"
              onClick={deleteSelectedRows}
            >
              Eliminar Filas Seleccionadas
            </button>
          </div>

          <form className="form-container" onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              value={newMajor.name}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
            />

            <select
              name="facultyId"
              value={newMajor.facultyId || ''}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Seleccione una facultad</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>

            <button className="my-button" type="submit">
              Añadir nueva carrera
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
