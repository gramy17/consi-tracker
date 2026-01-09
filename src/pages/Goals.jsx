import React from 'react'

const Goals = () => {
  return (
    <div>
      <div  className='m-2 shadow-md rounded-xl border border-gray-300'>
        <div className='flex flex-cols-1 item-centre justify-between p-4'>
        <h1 className='px-4 py-2'>Goals</h1>
        <button className='rounded-md bg-blue-500 text-white px-4 py-2'>Add Goal</button>
      </div>
      <hr />
      <div className='m-2 p-1'>
        Goals are few visible , and long term . Update progress manually and lunk tasks
        
      </div>
      </div>
      <div className='m-2 p-4 shadow-md rounded-xl border border-gray-300'>
        No Goals Added
      </div>
    </div>
  )
}

export default Goals
