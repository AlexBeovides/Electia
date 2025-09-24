import '../../styles/Manager.scss';
import { API_BASE_URL } from '../../config';
import { AG_GRID_LOCALE_ES } from '../../types/agGridLocaleEs';

import { useEffect, useState, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, RowSelectionOptions } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  id: number;
  name: string;
}

type Center = {
  name: string;
};

export const CentersManager = () => {
  const [newCenter, setNewCenter] = useState<Center>({ name: '' });
  const [rowData, setRowData] = useState<IRow[]>([]);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    filter: true,
    editable: true, // Enable editing for all columns by default
  }), []);

  const colDefs: ColDef<IRow>[] = useMemo(() => [ 
    { field: 'name', headerName: 'Nombre' }, // 'name' is editable by defaultColDef
  ], []);

  const rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: false,
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_BASE_URL}/Centers`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Response:', data);
        setRowData(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    fetch(`${API_BASE_URL}/Centers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCenter),
    })
      .then((response) => response.json())
      .then((data) => {
        setRowData((prevData) => [...prevData, data]);
        setNewCenter({ name: '' }); // Reset form
      })
      .catch((error) => console.error('Error:', error));
  };

  const onCellValueChanged = (params: any) => {
    const updatedData = params.data;

    fetch(`${API_BASE_URL}/Centers/${updatedData.id}`, {
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
        console.error('Error updating Center:', error);
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
        fetch(`${API_BASE_URL}/Centers/${id}`, {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCenter({ ...newCenter, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="manager-page-container">
        <h2 className="page-header">Centros:</h2>
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
              value={newCenter.name}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
            />
            <button className="my-button" type="submit">
              Añadir nuevo centro
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
