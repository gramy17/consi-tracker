import React from 'react'

const Tasks = () => {
  return (
    <div className='text-slate-800'>
      <div  className='m-2 shadow-md rounded-xl border border-gray-300 bg-[#DCE8FF]'>
        <div className='flex flex-cols-1 item-centre justify-between p-4 '>
        <h1 className='px-4 py-2 '>Tasks</h1>
        <button className='px-4 py-2 rounded-md bg-[#4B0879] text-white text-sm font-medium hover:opacity-90 transition'>Add Task</button>
      </div>
      <hr />
      <div className='flex flex-cols justify-around m-2'>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <br />
          <select className='rounded-md' name="" id="">
            <option value="">All</option>
            <option value="">Completed</option>
            <option value="">Pending</option>
          </select>
        </div>
        
      </div>
      </div>
      <div className='m-2 p-4 shadow-md rounded-xl border border-gray-300 bg-[#DCE8FF]'>
        No Tasks Added
      </div>
    </div>
  )
}

export default Tasks
