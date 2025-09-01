'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { User, Edit3, Save, Camera, Mail, Phone, Home } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setName(data.full_name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setProfilePic(data.avatar_url || '');
        }
        if (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!userId) return;

    const { error } = await supabase.from('profiles').update({
      full_name: name,
      phone: phone,
      address: address,
      updated_at: new Date(),
    }).eq('id', userId);

    if (error) {
      alert('Error al actualizar el perfil: ' + error.message);
    } else {
      alert('Perfil actualizado con éxito');
      setIsEditing(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Error al subir la imagen: ' + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase.from('profiles').update({
      avatar_url: publicUrl,
    }).eq('id', userId);

    if (updateError) {
      alert('Error al actualizar la foto de perfil: ' + updateError.message);
    } else {
      setProfilePic(publicUrl);
    }
  };

  return (
    <div className="text-white p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfil del Pasajero</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isEditing ? <Save onClick={handleSave} /> : <Edit3 />}
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={profilePic || 'https://i.pravatar.cc/150'}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700">
              <Camera />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
        </div>

        {
          isEditing ? (
            <div className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-semibold flex items-center gap-2"><User size={16}/>Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1 font-semibold flex items-center gap-2"><Phone size={16}/>Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
                  placeholder="+54 11 1234-5678"
                />
              </div>
               <div>
                <label htmlFor="email" className="block mb-1 font-semibold flex items-center gap-2"><Mail size={16}/>Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                />
              </div>
               <div>
                <label htmlFor="address" className="block mb-1 font-semibold flex items-center gap-2"><Home size={16}/>Dirección</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          ) : (
            <div className="text-left w-full space-y-3">
              <p className="flex items-center gap-3"><User /> <span className="font-semibold">{name || 'Sin nombre'}</span></p>
              <p className="flex items-center gap-3"><Mail /> <span>{email || 'Sin email'}</span></p>
              <p className="flex items-center gap-3"><Phone /> <span>{phone || 'Sin teléfono'}</span></p>
              <p className="flex items-center gap-3"><Home /> <span>{address || 'Sin dirección'}</span></p>
            </div>
          )
        }
      </div>
    </div>
  );
}
