import React from 'react'
import { NavLink ,useNavigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard,FileText,User,LogOut,BrainCircuit,BookOpen ,X } from 'lucide-react'
const Sidebar = ({isSidebarOpen, toggleSidebar}) => {

  const {logout} = useAuth()
  const navigate =useNavigate()

  const handleLogout=()=>{
    logout()
    navigate('/login')
  }

  const navLinks=[
    {to:'/dashboard',icon:LayoutDashboard ,text:'Dashboard'},
    {to:'/documents',icon:FileText ,text:'Documents'},
    {to:'/flashcards',icon:BookOpen ,text:'Flashcards'},
    
{to:'/profile',icon:User ,text:'Profile'},
  ];
    
  return (
    <>
    <div className={`fixed insert-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 
    ${  isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }`} 
      Click={toggleSidebar} aria-hidden="true"></div>

      <aside className={`fixedtop-0 left-0 h-full w-64 bg-white/90 backdrop-blulr-lg- border-r border-slate-200/60 z-50
       md-relative md:w-64 md-shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform
        duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' :'-translate-x-full'}`} />

{/* 
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    > */}

      {/* Logo and Close button for mobile */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200/60">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500">
            <BrainCircuit className="text-white" size={20} strokeWidth={2.5} />
          </div>

          <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
            AI Learning
          </h1>
        </div>

        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-500 hover:text-slate-900"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
              ${
                isActive
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {({ isActive}) =>(
              <>
                 <link.icon size={18} strokeWidth={2.5} 
                 className={`transition-transform duration-200 ${isActive ? '' :'group-hover:scale-110' }`}/>
                 {link.text}
              </>
            )}
         
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className=''>
        <button onClick={handleLogout} className='flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 mt-auto w-full'>
      
        <logout
      </div>

    </>
  );
};
export default Sidebar
