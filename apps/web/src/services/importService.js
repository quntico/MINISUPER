
import * as XLSX from 'xlsx';
import pb from '@/lib/pocketbase.js';

export const downloadInventoryTemplate = () => {
  const templateData = [
    {
      SKU: 'PROD-001',
      Barcode: '7501234567890',
      Producto: 'Ejemplo Producto',
      Categoría: 'Abarrotes',
      Costo: 10.50,
      Precio: 15.00,
      Stock: 100
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
  XLSX.writeFile(workbook, 'Plantilla_Inventario.xlsx');
};

export const importInventoryFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        let created = 0;
        let updated = 0;
        let errors = 0;
        const errorDetails = [];

        let fallbackCompanyId = pb.authStore.model?.company_id;
        let fallbackBranchId = pb.authStore.model?.branch_id;

        // Si no hay empresa/sucursal en el usuario, buscamos la primera disponible
        if (!fallbackCompanyId || !fallbackBranchId) {
          try {
            const firstBranch = await pb.collection('branches').getFirstListItem('', { $autoCancel: false });
            if (firstBranch) {
              fallbackCompanyId = firstBranch.company_id;
              fallbackBranchId = firstBranch.id;
            }
          } catch (e) {
            console.warn('No se encontró sucursal por defecto. Es posible que la base de datos esté vacía.');
          }
        }

        // Si después de buscar seguimos sin IDs, lanzamos un error claro
        if (!fallbackCompanyId || !fallbackBranchId) {
          throw new Error('Primero debes crear una Empresa y una Sucursal en el panel de Configuración para poder importar productos.');
        }

        for (const row of json) {
          try {
            // Mapeo exacto basado en la foto del usuario
            const name = row.Producto || row.Nombre || row.item;
            const price = parseFloat(String(row["P. Venta"] || row.Precio || 0).replace(/[$,]/g, '')) || 0;
            const cost = parseFloat(String(row["P. Costo"] || row.Costo || 0).replace(/[$,]/g, '')) || 0;
            const stockValue = row.Existencia !== undefined ? row.Existencia : (row.Stock !== undefined ? row.Stock : 0);
            const stock = parseFloat(stockValue) || 0; // Usar float para casos como 5.32
            const code = String(row.Código || row.Codigo || row.SKU || '').trim();
            const category = row.Departamento || row.Categoría || row.Categoria || 'General';

            if (!name) {
              // Si no hay nombre, saltamos la fila silenciosamente o lanzamos error si es crítica
              continue; 
            }

            const productData = {
              name: name,
              sku: code,
              barcode: code, // Usamos el código para ambos campos
              category: category,
              cost: cost,
              price: price,
              stock: stock,
              is_active: true,
              company_id: fallbackCompanyId,
              branch_id: fallbackBranchId
            };

            // Check if exists by SKU
            let existing = null;
            if (productData.sku) {
              try {
                existing = await pb.collection('products').getFirstListItem(`sku="${productData.sku}"`, { $autoCancel: false });
              } catch (err) {
                // Not found, continue
              }
            }

            if (existing) {
              await pb.collection('products').update(existing.id, productData, { $autoCancel: false });
              updated++;
            } else {
              await pb.collection('products').create(productData, { $autoCancel: false });
              created++;
            }
          } catch (err) {
            errors++;
            errorDetails.push(`Fila: ${row.Producto || 'Desconocido'} - ${err.message}`);
          }
        }
        
        resolve({ created, updated, errors, errorDetails });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
