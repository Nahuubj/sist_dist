import { LabelModel } from '../postgres/postgres.js'; // Asegúrate de importar el modelo Label

// Función para obtener todas las etiquetas (labels)
export const getAllLabels = async (req, res) => {
    try {
      const labels = await LabelModel.findAll();  // Asegúrate de que se ejecute esta consulta correctamente
  
      if (labels.length === 0) {
        return res.status(404).json({ error: 'No labels found' });
        console.log(labels);  // Imprime los resultados para depurar

      }
  
      return res.status(200).json(labels);  // Retorna las etiquetas
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
