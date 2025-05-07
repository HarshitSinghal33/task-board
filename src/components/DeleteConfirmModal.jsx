import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

const DeleteConfirmModal = ({setDeleteConfirm, deleteTask, deleteConfirm}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <FaExclamationCircle size={24} />
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
            </div>
            <p className="mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm({ show: false, taskId: null })}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTask(deleteConfirm.taskId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
  )
}

export default DeleteConfirmModal