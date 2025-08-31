'use client';

import { useState } from 'react';
import { User, Edit3, Save, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('123-456-7890');
  const [profilePic, setProfilePic] = useState('https://i.pravatar.cc/150');

  const handleSave = () => {
    // TODO: Save to Supabase
    setIsEditing(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
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
          {isEditing ? <Save /> : <Edit3 />}
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={profilePic}
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
                <label htmlFor="name" className="block mb-1 font-semibold">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1 font-semibold">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>
              <button onClick={handleSave} className="bg-red-600 p-2 rounded hover:bg-red-700 transition-colors self-end">
                Guardar
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold">{name}</p>
              <p className="text-gray-400">john.doe@example.com</p>
              <p className="text-gray-400">{phone}</p>
            </div>
          )
        }
      </div>
    </div>
  );
}
