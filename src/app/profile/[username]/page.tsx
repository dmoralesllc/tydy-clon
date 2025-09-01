'use client';

import { useParams } from 'next/navigation';

// Mock data for user profiles. In a real app, you'd fetch this from a database.
const userProfiles = {
  explorador_urbano: {
    followers: '1.2M',
    following: 120,
    likes: '15.7M',
    bio: 'Recorriendo cada rincón de la ciudad. 🏙️'
  },
  naturaleza_viva: {
    followers: '3.8M',
    following: 50,
    likes: '42.1M',
    bio: 'Amante de la naturaleza y la vida salvaje. 🌲🦉'
  },
  ritmo_callejero: {
    followers: '5.1M',
    following: 250,
    likes: '68.3M',
    bio: 'El baile es mi pasión. La calle es mi escenario. 💃'
  }
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const profileData = userProfiles[username] || { followers: 0, following: 0, likes: 0, bio: 'Este usuario no existe.' };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-700 flex-shrink-0">
            {/* Placeholder for Profile Picture */}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">@{username}</h2>
            <p className="text-gray-400 mt-1">{profileData.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around md:justify-start md:space-x-10 mb-8 bg-gray-800 p-4 rounded-lg">
          <div className="text-center">
            <span className="font-bold text-lg">{profileData.following}</span>
            <p className="text-gray-400 text-sm">Siguiendo</p>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{profileData.followers}</span>
            <p className="text-gray-400 text-sm">Seguidores</p>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{profileData.likes}</span>
            <p className="text-gray-400 text-sm">Me gusta</p>
          </div>
        </div>

        {/* Video Grid Placeholder */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Publicaciones</h3>
          <div className="grid grid-cols-3 gap-1">
            {/* In the future, user's videos will be mapped here */}
            <div className="aspect-square bg-gray-700"></div>
            <div className="aspect-square bg-gray-700"></div>
            <div className="aspect-square bg-gray-700"></div>
            <div className="aspect-square bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
