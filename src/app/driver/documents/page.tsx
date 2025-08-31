'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const documentsList = [
  { 
    name: 'Licencia de Conducir (Frente)', 
    status: 'approved', 
    details: 'Válida hasta 2026-05-18'
  },
  { 
    name: 'Licencia de Conducir (Dorso)', 
    status: 'approved', 
    details: 'Verificado'
  },
  { 
    name: 'Cédula de Identidad (Frente)', 
    status: 'pending', 
    details: 'En revisión'
  },
  { 
    name: 'Cédula de Identidad (Dorso)', 
    status: 'pending', 
    details: 'En revisión'
  },
  { 
    name: 'Certificado de Antecedentes', 
    status: 'rejected', 
    details: 'Documento ilegible. Por favor, sube una imagen más clara.'
  },
  { 
    name: 'Seguro del Vehículo', 
    status: 'missing', 
    details: 'Aún no has subido este documento.'
  },
];

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="text-green-500" />;
    case 'pending':
      return <Clock className="text-yellow-500" />;
    case 'rejected':
      return <AlertCircle className="text-red-500" />;
    default:
      return <AlertCircle className="text-gray-500" />;
  }
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState(documentsList);

  const handleFileUpload = (docName, fileName) => {
    // Aquí iría la lógica para subir el archivo a un servidor.
    // Por ahora, simulamos la actualización del estado.
    const newDocs = docs.map(doc => {
      if (doc.name === docName) {
        return { ...doc, status: 'pending', details: `Subido: ${fileName}` };
      }
      return doc;
    });
    setDocs(newDocs);
  };

  return (
    <div className="text-white p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Documentos</h1>
      <p className="text-gray-400 mb-8">
        Mantén tus documentos actualizados para seguir conduciendo. 
        Los documentos en revisión pueden tardar hasta 48 horas en ser aprobados.
      </p>

      <div className="space-y-4">
        {docs.map((doc) => (
          <div key={doc.name} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <StatusIcon status={doc.status} />
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className={`text-sm ${ 
                    doc.status === 'approved' ? 'text-green-400' :
                    doc.status === 'pending' ? 'text-yellow-400' :
                    doc.status === 'rejected' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {doc.details}
                  </p>
                </div>
              </div>
              <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center">
                <Upload size={18} className="mr-2" />
                <span>{doc.status === 'missing' ? 'Subir' : 'Actualizar'}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(doc.name, e.target.files[0].name)} 
                />
              </label>
            </div>
            {doc.status === 'rejected' && 
              <p className="text-red-300 bg-red-900/50 p-3 mt-3 rounded-md text-sm">Motivo del rechazo: {doc.details}</p>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
