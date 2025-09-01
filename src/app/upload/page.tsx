'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!videoFile || !description) {
      alert('Por favor, selecciona un video y añade una descripción.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Subir el video a Supabase Storage
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obtener la URL pública del video subido
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      const publicURL = urlData.publicUrl;

      // 3. Guardar los datos en la tabla 'posts' de la base de datos
      const { error: dbError } = await supabase.from('posts').insert({
        // user_id y username serán estáticos por ahora
        username: 'usuario_prueba',
        description: description,
        video_url: publicURL,
      });

      if (dbError) {
        throw dbError;
      }

      // 4. Éxito
      alert('¡Video publicado con éxito!');
      router.push('/feed'); // Redirigir al feed

    } catch (error) {
      console.error('Error al publicar:', error);
      alert(`Error al publicar el video: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Subir Video</h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div 
            className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-center mb-6 cursor-pointer hover:border-red-500 hover:bg-gray-700 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {videoPreview ? (
              <video src={videoPreview} controls className="w-full h-full object-contain rounded-lg"></video>
            ) : (
              <>
                <UploadCloud size={48} className="text-gray-500 mb-2" />
                <p className="font-semibold">Haz clic para seleccionar un video</p>
                <p className="text-xs text-gray-400">MP4, WebM, etc.</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Descripción</label>
            <textarea 
              id="description"
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
              placeholder="Añade una descripción, hashtags, @menciones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            onClick={handlePublish}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={!videoFile || !description || isUploading}
          >
            {isUploading ? (
              <><Loader2 className="animate-spin mr-2" /> Publicando...</>
            ) : (
              'Publicar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
