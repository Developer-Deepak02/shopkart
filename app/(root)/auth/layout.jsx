import React from 'react'

const layout = ({children}) => {
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      {children}
    </div>
  )
}

export default layout
