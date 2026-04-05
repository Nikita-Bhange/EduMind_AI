import React from 'react'

const Tabs = ({tabs,activeTab, setActiveTab}) => {
  return (
    <div className="w-full">
      <div className="relative border-b-2 border-slate-100 ">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`relative pb-4 md:px-6 px-2 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                activeTab === tab.name
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab && setActiveTab(tab.name)}
            >
                <span className="relative z-10">
              {tab.label}
              </span>
              {activeTab === tab.name && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"/>

                    )}
                     {activeTab === tab.name && (
                       <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"/>


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