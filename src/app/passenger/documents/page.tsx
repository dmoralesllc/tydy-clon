'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Upload, Camera, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const FileUploader = ({ title, documentType, userId, onUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${documentType}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Error al subir el archivo: ' + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);

    const { error: dbError } = await supabase.from('documents').upsert({
      user_id: userId,
      document_type: documentType,
      file_url: publicUrl,
      status: 'pending'
    }, { onConflict: 'user_id, document_type' });

    if (dbError) {
      alert('Error al guardar el documento: ' + dbError.message);
    } else {
      onUpload();
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="font-semibold mb-2">{title}</p>
      <div className="flex justify-center gap-4">
        <label className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          <Upload size={20} />
          Subir Archivo
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

const DocumentStatus = ({ title, status }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg bg-gray-800`}>
        <div className="flex items-center gap-3">
            <FileText />
            <span>{title}</span>
        </div>
        <div className={`flex items-center gap-2 font-semibold ${
            status === 'approved' ? 'text-green-400' :
            status === 'rejected' ? 'text-red-400' :
            'text-yellow-400'
        }`}>
            {status === 'approved' && <CheckCircle size={20} />}
            {status === 'rejected' && <XCircle size={20} />}
            {status === 'pending' && <Clock size={20} />}
            {status == null && <Clock size={20} />}
            <span>
                {status === 'approved' ? 'Aprobado' :
                status === 'rejected' ? 'Rechazado' :
                status === 'pending' ? 'Pendiente' :
                'No subido'}
            </span>
        </div>
    </div>
);

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [userId, setUserId] = useState(null);
  const documentTypes = [
    { name: 'Foto de Perfil', type:'profile_pic'},
    { name: 'DNI (Frente)', type: 'dni_front'},
    { name: 'DNI (Dorso)', type: 'dni_back'},
    { name: 'Certificado de Antecedentes', type: 'background_check'}
  ];

  const fetchDocuments = async (currentUserId) => {
      if (!currentUserId) return;
      const { data, error } = await supabase
        .from('documents')
        .select('document_type, status')
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      const userDocs = documentTypes.map(docType => {
        const foundDoc = data.find(d => d.document_type === docType.type);
        return {
          name: docType.name,
          type: docType.type,
          status: foundDoc ? foundDoc.status : null
        };
      });
      setDocuments(userDocs);
    };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        setUserId(user.id);
        fetchDocuments(user.id)
      }
    };
    fetchUser();
  }, []);

  const handleUpload = () => {
    fetchDocuments(userId);
  }

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Mis Documentos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {documentTypes.map(docType => (
          <FileUploader key={docType.type} title={docType.name} documentType={docType.type} userId={userId} onUpload={handleUpload} />
        ))}
      </div>

      <div>
          <h2 className="text-xl font-semibold mb-4">Estado de los Documentos</h2>
          <div className="space-y-4">
              {documents.map(doc => (
                  <DocumentStatus key={doc.type} title={doc.name} status={doc.status} />
              ))}
          </div>
      </div>

    </div>
  );
}
