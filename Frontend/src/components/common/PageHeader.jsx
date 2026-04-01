import React from 'react'

const PageHeader = ({title,subtitle, children}) => {
  return (
    <>
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">{title}</h1>
         {subtitle &&  (<p className="text-sm text-gray-500">{subtitle}</p> )}
        </div>
        {children && (
          <div className="mt-4">
            {children}  
          </div>
        )}

    </>
  )
}

export default PageHeader