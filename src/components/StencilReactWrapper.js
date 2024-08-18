import React from 'react';
import ReactDOM from 'react-dom';
import ReactDataTable from './ReactDataTable';

class StencilReactWrapper extends HTMLElement {
  connectedCallback() {
    const columns = [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nombre', accessor: 'nombre' },
      { Header: 'Precio', accessor: 'precio' },
      { Header: 'Imagen', accessor: 'imagen' },
      { Header: 'Stock', accessor: 'stock' },
      { Header: 'Categoría', accessor: 'categoria' },
    ];

    const data = JSON.parse(this.getAttribute('data') || '[]');

    ReactDOM.render(
      <ReactDataTable columns={columns} data={data} />,
      this
    );
  }
}

customElements.define('stencil-react-wrapper', StencilReactWrapper);