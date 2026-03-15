
export const generateDiagnosticHTML = (diagnostic) => {
  const formatCurrency = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('es-MX');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Radiografía del Sistema - ${diagnostic.metadata.systemName}</title>
  <style>
    :root {
      --primary: ${diagnostic.branding.primaryColor};
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--primary);
    }
    .header h1 {
      color: var(--primary);
      margin: 0 0 10px 0;
      font-size: 2.5rem;
    }
    .header p {
      color: var(--text-muted);
      margin: 0;
    }
    .section {
      background: var(--surface);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border);
    }
    .section h2 {
      color: var(--primary);
      margin-top: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      font-size: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--bg);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .card h3 {
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      color: var(--text);
    }
    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--primary);
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      background-color: var(--bg);
      font-weight: 600;
      color: var(--text-muted);
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      background: #dcfce7;
      color: #166534;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Radiografía del Sistema</h1>
      <p>${diagnostic.metadata.systemName} - ${diagnostic.metadata.type} v${diagnostic.metadata.version}</p>
      <p>Generado el: ${formatDate(diagnostic.metadata.exportDate)}</p>
    </div>

    <div class="section">
      <h2>Estadísticas Principales</h2>
      <div class="grid">
        <div class="card">
          <h3>Ventas Totales</h3>
          <div class="stat-value">${formatCurrency(diagnostic.statistics.totalSalesAmount)}</div>
          <p style="margin:0; color:var(--text-muted)">${diagnostic.statistics.totalSales} tickets emitidos</p>
        </div>
        <div class="card">
          <h3>Valor de Inventario</h3>
          <div class="stat-value">${formatCurrency(diagnostic.statistics.inventoryValue)}</div>
          <p style="margin:0; color:var(--text-muted)">${diagnostic.statistics.totalProducts} productos registrados</p>
        </div>
        <div class="card">
          <h3>Ticket Promedio</h3>
          <div class="stat-value">${formatCurrency(diagnostic.statistics.averageTicket)}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Módulos del Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Estado</th>
            <th>Características Principales</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(diagnostic.modules).map(([key, mod]) => `
            <tr>
              <td style="text-transform: capitalize; font-weight: 500;">${key}</td>
              <td><span class="badge">${mod.status}</span></td>
              <td>${mod.features.join(', ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Base de Datos y Almacenamiento</h2>
      <table>
        <thead>
          <tr>
            <th>Colección</th>
            <th>Tipo</th>
            <th>Registros</th>
          </tr>
        </thead>
        <tbody>
          ${diagnostic.storage.collections.map(col => `
            <tr>
              <td style="font-family: monospace;">${col.name}</td>
              <td>${col.type}</td>
              <td>${col.recordCount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Tecnología y Entorno</h2>
      <div class="grid">
        <div class="card">
          <h3>Stack Tecnológico</h3>
          <ul style="margin:0; padding-left:20px;">
            <li>Frontend: ${diagnostic.technology.frontend}</li>
            <li>Routing: ${diagnostic.technology.routing}</li>
            <li>Estilos: ${diagnostic.technology.styling}</li>
            <li>Backend: ${diagnostic.technology.backend}</li>
          </ul>
        </div>
        <div class="card">
          <h3>Conexiones</h3>
          <ul style="margin:0; padding-left:20px;">
            <li>Base de Datos: <span class="badge">${diagnostic.connections.pocketbase.status}</span></li>
            <li>Internet: <span class="badge">${diagnostic.connections.internet.status}</span></li>
            <li>Entorno: ${diagnostic.metadata.environment}</li>
          </ul>
        </div>
        <div class="card">
          <h3>Seguridad</h3>
          <ul style="margin:0; padding-left:20px;">
            <li>Autenticación: ${diagnostic.security.authentication}</li>
            <li>HTTPS: ${diagnostic.security.https ? 'Activo' : 'Inactivo'}</li>
            <li>Validación: ${diagnostic.security.dataValidation}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Documento generado automáticamente por el Centro de Inteligencia de ${diagnostic.metadata.systemName}.</p>
      <p>La información sensible ha sido omitida por seguridad.</p>
    </div>
  </div>
</body>
</html>
  `;
};
