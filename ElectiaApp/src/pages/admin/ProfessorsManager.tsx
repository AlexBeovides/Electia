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
  userId: string;
  fullName: string;
  primaryEmail: string;
  teacherCategoryName: string;
  academicDegreeName: string;
  landline?: string;
  phoneNumber: string;
  secondaryEmail?: string;
}

export const ProfessorsManager = () => {
  const [rowData, setRowData] = useState<IRow[]>([]);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    filter: true,
    editable: true,
  }), []);

  const colDefs: ColDef<IRow>[] = useMemo(() => [
    { field: 'fullName', headerName: 'Nombre completo' },
    { field: 'primaryEmail', headerName: 'Correo primario' },
    { field: 'teacherCategoryName', headerName: 'Categoría docente', editable: false},
    { field: 'academicDegreeName', headerName: 'Grado académico' , editable: false },
    { field: 'landline', headerName: 'Teléfono fijo' },
    { field: 'phoneNumber', headerName: 'Teléfono móvil' },
    { field: 'secondaryEmail', headerName: 'Correo secundario' },
 ], []);

  const rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: false,
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_BASE_URL}/Professors/ForCatalog`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response:', data);
        setRowData(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  

  const onCellValueChanged = (params: any) => {
    const updatedData = params.data;

    fetch(`${API_BASE_URL}/Professors/${updatedData.userId}`, {
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
        console.error('Error updating professor:', error);
      });
  };

  const gridRef = useRef<AgGridReactType<IRow>>(null);

  const deleteSelectedRows = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];

    if (selectedRows.length === 0) {
      alert('Por favor, selecciona al menos una fila para eliminar.');
      return;
    }

    const selectedIds = selectedRows.map(row => row.userId);

    Promise.all(
      selectedIds.map(id =>
        fetch(`${API_BASE_URL}/Professors/${id}`, {
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
          setRowData(prevData => prevData.filter(row => !selectedIds.includes(row.userId)));
          alert('Profesores eliminados exitosamente.');
        } else {
          alert('Ocurrió un error al eliminar algunos profesores.');
        }
      })
      .catch(error => {
        console.error('Error al eliminar profesores:', error);
        alert('Ocurrió un error al eliminar los profesores.');
      });
  };

  return (
    <>
      <div className="manager-page-container">
        <h2 className="page-header">Profesores:</h2>
        <div className="section-container">
          <div className="table-container">
            <div className="manager-table" style={{ height: 400, width: 1200 }}>
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
        </div>
      </div>
    </>
  );
};
