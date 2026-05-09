import React from 'react'

const Tabs = ({tabs,activeTab, setActiveTab}) => {
  return (
    <div className="w-full">
      <div className="relative border-b-2 border-slate-100 dark:border-[#2a2a2a]">
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`relative pb-4 md:px-6 px-2 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                activeTab === tab.name
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 dark:bg-[#784BA0] dark:shadow-[#7A00FF]/30'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-[#1c1c1c] dark:hover:text-[#ff8bcb]'
              }`}
              onClick={() => setActiveTab && setActiveTab(tab.name)}
            >
                <span className="relative z-10">
              {tab.label}
              </span>
              {activeTab === tab.name && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-[#FF3CAC]"/>
                    )}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
       {tabs.map((tab)=>{
        if(tab.name === activeTab){
          return (
            <div key={tab.name} className='animate-in fade-in duration-300'>
              {tab.content}
            </div>
          )
        }
        return null;
       })}
      </div>
    </div>
  )
}

export default Tabs
