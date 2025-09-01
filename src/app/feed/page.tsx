'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNavBar from '../../components/BottomNavBar';
import { supabase } from '../../lib/supabaseClient';
import type { Database } from '../../lib/database.types';
import { Heart, MessageCircle, Bookmark, Share2, Music, User } from 'lucide-react';

// Tipos de la base de datos
type Post = Database['public']['Tables']['posts']['Row'];

// --- Sub-componentes para un UI más limpio ---

// Barra de acciones lateral
const SideActionBar = ({ post }: { post: Post }) => {
  // Formatear números grandes (ej: 56100 -> 56.1k)
  const formatCount = (num: number | null) => {
    if (num === null) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="absolute bottom-24 right-2 flex flex-col items-center space-y-6 z-10">
      {/* Perfil del creador */}
      <div className="flex flex-col items-center cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center border-2 border-white relative">
          <User className="text-white" size={28}/>
          <div className="absolute -bottom-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
        </div>
      </div>
      {/* Likes */}
      <div className="flex flex-col items-center cursor-pointer text-white">
        <Heart size={36} fill="white" />
        <span className="text-sm font-bold mt-1">{formatCount(post.likes_count)}</span>
      </div>
      {/* Comentarios */}
      <div className="flex flex-col items-center cursor-pointer text-white">
        <MessageCircle size={36} fill="white" />
        <span className="text-sm font-bold mt-1">{formatCount(post.comments_count)}</span>
      </div>
      {/* Guardados (Bookmarks) - Asumimos un campo 'bookmarks_count' */}
      <div className="flex flex-col items-center cursor-pointer text-white">
        <Bookmark size={36} fill="white"/>
        <span className="text-sm font-bold mt-1">{formatCount(null)}</span> {/* Reemplazar con post.bookmarks_count si existe */}
      </div>
       {/* Compartir - Asumimos un campo 'shares_count' */}
      <div className="flex flex-col items-center cursor-pointer text-white">
        <Share2 size={36} />
        <span className="text-sm font-bold mt-1">{formatCount(null)}</span> {/* Reemplazar con post.shares_count si existe */}
      </div>
      {/* Disco de música */}
      <div className="mt-4 animate-spin-slow">
        <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
           <Music size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

// Información del video en la parte inferior
const VideoInfo = ({ post }: { post: Post }) => (
  <div className="absolute bottom-24 left-4 text-white z-10 w-2/3">
    <Link href={`/profile/${post.username}`} legacyBehavior>
        <a className="font-bold text-lg hover:underline cursor-pointer">@{post.username}</a>
    </Link>
    <p className="text-sm mt-1 whitespace-pre-wrap">{post.description}</p>
    <div className="flex items-center mt-2">
        <Music size={16} className="mr-2" />
        <p className="text-sm truncate">Sonido Original - {post.username}</p>
    </div>
  </div>
);

// Componente principal del Post de Video
const VideoPost = ({ post }: { post: Post }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.error("Error playing video:", e));
        } else {
          videoRef.current?.pause();
        }
      });
    }, { threshold: 0.5 });

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) observer.observe(currentVideoRef);
    return () => { if (currentVideoRef) observer.unobserve(currentVideoRef); };
  }, []);

  return (
    <div className="h-screen w-full bg-black snap-start flex justify-center items-center relative">
      <video
        ref={videoRef}
        src={post.video_url}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
      ></video>
      
      <div className="absolute top-0 left-0 right-0 h-full w-full bg-black bg-opacity-10"></div>
      
      <VideoInfo post={post} />
      <SideActionBar post={post} />
    </div>
  );
};

const TopNav = () => (
    <div className="absolute top-0 left-0 right-0 pt-10 px-4 z-10 flex justify-center items-center text-white font-semibold text-lg">
        <span className="text-gray-400 px-3">Explorar</span>
        <span className="text-gray-400 px-3">Siguiendo</span>
        <span className="text-white border-b-2 pb-1 px-3">Para ti</span>
    </div>
);

// --- Página Principal del Feed ---
export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Cargando...</div>;
  }
  if (error) {
    return <div className="h-screen bg-black flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative h-screen bg-black">
        <TopNav />
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
            {posts.length > 0 ? (
            posts.map(post => <VideoPost key={post.id} post={post} />)
            ) : (
            <div className="h-screen bg-black flex flex-col items-center justify-center text-white text-center snap-start p-4">
                <h2 className="text-2xl font-bold mb-2">No hay videos todavía</h2>
                <p className="text-gray-400 mb-4">¡Sé el primero en subir algo!</p>
                <Link href="/upload" legacyBehavior>
                <a className="bg-white text-black font-bold py-3 px-6 rounded-lg text-lg transition-transform hover:scale-105">
                    Subir Video
                </a>
                </Link>
            </div>
            )}
        </div>
        <BottomNavBar />
    </div>
  );
}
