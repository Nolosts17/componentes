import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'componente-tarea-manolo',
  styleUrl: 'componente-tarea-manolo.css',
  shadow: true,
})
export class ComponenteTareaManolo {
  @Prop() apiUrl: string; // Propiedad para recibir la URL de la API

  @State() data: any[] = []; // Estado para almacenar los datos de la API
  @State() filteredData: any[] = []; // Estado para almacenar los datos filtrados
  @State() error: string = ''; // Estado para almacenar los mensajes de error
  @State() sortColumn: string = ''; // Columna por la cual ordenar
  @State() sortOrder: 'asc' | 'desc' = 'asc'; // Orden de la columna
  @State() searchTerm: string = ''; // Término de búsqueda

  async componentWillLoad() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Error en la solicitud de la API');
      }
      const result = await response.json();
      this.data = result;
      this.filteredData = result; // Inicializa los datos filtrados
    } catch (e) {
      this.error = e.message;
    }
  }

  // Método para manejar la ordenación de datos
  handleSort(column: string) {
    const order = this.sortColumn === column && this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.sortOrder = order;

    this.filteredData.sort((a, b) => {
      if (a[column] < b[column]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Método para manejar la búsqueda
  handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filteredData = this.data.filter(item => 
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(this.searchTerm)
      )
    );
  }

  // Método para manejar la visualización de datos
  handleViewAll() {
    this.filteredData = this.data;
    this.searchTerm = ''; // Limpia el término de búsqueda
  }

  // Método para mostrar una alerta con los detalles del item
  handleShowDetails(item: any) {
    const details = `ID: ${item.id}\nNombre: ${item.nombre}\nPrecio: ${item.precio}\nStock: ${item.stock}\nCategoría: ${item.categoria}`;
    alert(`Detalles del archivo:\n${details}`);
  }

  render() {
    return (
      <Host>
        <div class="container">
          {this.error ? (
            <p class="error-message">{this.error}</p>
          ) : (
            <div>
              <input 
                type="text" 
                placeholder="Buscar..." 
                onInput={(event) => this.handleSearch(event)} 
                value={this.searchTerm} 
              />
              <button onClick={() => this.handleViewAll()} class="view-all-button">👁️ Ver Todos</button>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => this.handleSort('id')}>ID</th>
                    <th onClick={() => this.handleSort('nombre')}>Nombre</th>
                    <th onClick={() => this.handleSort('precio')}>Precio</th>
                    <th>Imagen</th>
                    <th onClick={() => this.handleSort('stock')}>Stock</th>
                    <th onClick={() => this.handleSort('categoria')}>Categoría</th>
                    <th>Acciones</th> {/* Nueva columna para el ícono */}
                  </tr>
                </thead>
                <tbody>
                  {this.filteredData.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nombre}</td>
                      <td>{item.precio}</td>
                      <td>
                        <img src={item.imagen} alt={item.nombre} />
                      </td>
                      <td>{item.stock}</td>
                      <td>{item.categoria}</td>
                      <td>
                        <button 
                          class="view-icon-button" 
                          title="Ver detalles"
                          onClick={() => this.handleShowDetails(item)} // Añade el evento onClick
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
