import React,{useState} from 'react'
import  Sidebar  from './Sidebar.jsx'
import Header from './Header'
const AppLayout = ({children}) => {
  const[isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSideBar=()=>{
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <>
    <div className='flex h-screen bg-neutral-50 text-neutral-900 dark:bg-[linear-gradient(145deg,#151515_0%,#0B0B0B_50%,#050505_100%)] dark:text-slate-100'>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSideBar={toggleSideBar}/>
      <div className='flex-1 flex flex-col overflow-hidden'> 
      <Header  toggleSideBar={toggleSideBar}/>
      <main className='relative flex-1 overflow-x-hidden overflow-y-auto p-6'>
        {children}
      </main>
</div>
    </div>
    </>
  )
}

export default AppLayout
