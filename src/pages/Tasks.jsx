import React from 'react'

const Tasks = () => {
  return (
    <div>
      <div shadow-md className='m-2  rounded-xl border border-gray-300'>
        <div className='flex flex-cols-1 item-centre justify-between p-4'>
        <h1 className='px-4 py-2'>Tasks</h1>
        <button className='rounded-md bg-blue-500 text-white px-4 py-2'>Add Task</button>
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
    </div>
  )
}

export default Tasks
