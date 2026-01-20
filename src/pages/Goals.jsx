import React from 'react'

const Goals = () => {
  return (
    <div className='text-slate-800'>
      <div  className='m-2 bg-[#DCE8FF] shadow-md rounded-xl border border-gray-300'>
        <div className='flex flex-cols-1 item-centre justify-between p-4'>
        <h1 className='px-4 py-2'>Goals</h1>
        <button className='px-4 py-2 rounded-md bg-[#4B0879] text-white text-sm font-medium hover:opacity-90 transition'>Add Goal</button>
      </div>
      <hr />
      <div className='bg-[#DCE8FF] m-2 p-1'>
        Goals are few visible , and long term . Update progress manually and lunk tasks
        
      </div>
      </div>
      <div className='m-2 p-4 shadow-md rounded-xl bg-[#DCE8FF] border border-gray-300'>
        No Goals Added
      </div>
    </div>
  )
}

export default Goals;