
// 'use client'
// import { useBatchIdSearchapiQuery, useBatchIdSearchQuery } from '@/redux/feature/stockSlice'
// import React, { useState } from 'react'

// export default function Batch() {
//   const [searchQuery, setSearchQuery] = useState('')


//   const {data: batch}=useBatchIdSearchapiQuery(searchQuery)
//   console.log(batch, 'batchid')

//   const { data, isLoading, error } = useBatchIdSearchQuery(searchQuery, {
//     skip: !searchQuery.trim(), // prevent unnecessary queries
//   })

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setSearchQuery(searchQuery.trim())
//   }

//   return (
//     <div className="p-4">
//       {/* Search Input Form */}
//       <form onSubmit={handleSearch} className="mb-4">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Enter Batch ID"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full max-w-md text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Search
//           </button>
//         </div>
//       </form>

//       {/* Loading and Error States */}
//       {isLoading && <div>Loading...</div>}
//       {error && <div className="text-red-500">Error loading data</div>}

//       {/* Show data when available */}
//       {data?.products?.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="">
//                 <th className="border border-gray-300 p-2 text-left">ID</th>
//                 <th className="border border-gray-300 p-2 text-left">Product</th>
//                 <th className="border border-gray-300 p-2 text-left">Stock</th>
//                 <th className="border border-gray-300 p-2 text-left">Cost Price</th>
//                 <th className="border border-gray-300 p-2 text-left">MRP</th>
//                 <th className="border border-gray-300 p-2 text-left">Selling Price</th>
//                 <th className="border border-gray-300 p-2 text-left">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products.map((product) => (
//                 <tr key={product.id}>
//                   <td className="border border-gray-300 p-2">{product.id}</td>
//                   <td className="border border-gray-300 p-2">{product.product}</td>
//                   <td className="border border-gray-300 p-2">{product.stock}</td>
//                   <td className="border border-gray-300 p-2">৳{product.cost_price}</td>
//                   <td className="border border-gray-300 p-2">৳{product.mrp}</td>
//                   <td className="border border-gray-300 p-2">৳{product.selling_price}</td>
//                   <td className="border border-gray-300 p-2">৳{product.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Summary Section */}
//           <div className="flex justify-between items-center mt-4 text-sm font-medium">
//             <p>Total Products: {data.total_products}</p>
//             <p className='pr-36'>Total Value: <span className="font-semibold text-green-600">৳{data.total_value}</span></p>
//           </div>
//         </div>
//       ) : (
//         searchQuery &&
//         !isLoading &&
//         !error && <div className="text-gray-500">No results found</div>
//       )}
//     </div>
//   )
// }
'use client'
import { useBatchIdSearchapiQuery, useBatchIdSearchQuery } from '@/redux/feature/stockSlice'
import React, { useState } from 'react'

export default function Batch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch batch IDs based on search query
  const { data: batch, isLoading: isBatchLoading, error: batchError } = useBatchIdSearchapiQuery(searchQuery, {
    skip: !searchQuery.trim(), // prevent unnecessary queries when searchQuery is empty
  })

  console.log(batch?.data, 'search')

  // Fetch product data for selected batch ID
  const { data, isLoading, error } = useBatchIdSearchQuery(selectedBatchId, {
    skip: !selectedBatchId, // prevent unnecessary queries
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchQuery.trim())
    setHasSearched(true) // Mark that a search has been performed
    setSelectedBatchId('') // Reset selected batch ID when new search is performed
  }

  const handleBatchClick = (batchId) => {
    setSelectedBatchId(batchId)
  }

  return (
    <div className="p-4">
      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Batch ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className='overflow-y-auto max-h-[200px]'>
          {
            batch?.data?.map((product) => (
              <div
                key={product.id}
                onClick={() => handleBatchClick(product.batch_id)}
                className={`cursor-pointer p-2 hover:bg-gray-400 rounded-md text-white ${selectedBatchId === product.batch_id ? 'bg-gray-500 font-semibold' : ''
                  }`}
              >
                {product.batch_id}
              </div>
            ))
          }
        </div>
      </form>

      {/* Batch ID List - Only show after search */}
      {hasSearched && (
        <>
          {isBatchLoading && <div>Loading batch IDs...</div>}
          {batchError && <div className="text-red-500">Error loading batch IDs</div>}
          {batch?.data?.length > 0 ? (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Matching Batch IDs</h3>
              <ul className="list-disc pl-5">
                {batch.data.map((batchItem) => (
                  <li
                    key={batchItem.batch_id}
                    onClick={() => handleBatchClick(batchItem.batch_id)}
                    className={`cursor-pointer p-2 hover:bg-gray-100 rounded-md ${selectedBatchId === batchItem.batch_id ? ' font-semibold' : ''
                      }`}
                  >
                    {batchItem.batch_id}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            !isBatchLoading &&
            !batchError && <div className="text-gray-500">No batch IDs found</div>
          )}
        </>
      )}

      {/* Loading and Error States for Product Data */}
      {isLoading && <div>Loading products...</div>}
      {error && <div className="text-red-500">Error loading product data</div>}

      {/* Show Product Data when Available */}
      {data?.products?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Product</th>
                <th className="border border-gray-300 p-2 text-left">Stock</th>
                <th className="border border-gray-300 p-2 text-left">Cost Price</th>
                <th className="border border-gray-300 p-2 text-left">MRP</th>
                <th className="border border-gray-300 p-2 text-left">Selling Price</th>
                <th className="border border-gray-300 p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 p-2">{product.id}</td>
                  <td className="border border-gray-300 p-2">{product.product}</td>
                  <td className="border border-gray-300 p-2">{product.stock}</td>
                  <td className="border border-gray-300 p-2">৳{product.cost_price}</td>
                  <td className="border border-gray-300 p-2">৳{product.mrp}</td>
                  <td className="border border-gray-300 p-2">৳{product.selling_price}</td>
                  <td className="border border-gray-300 p-2">৳{product.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="flex justify-between items-center mt-4 text-sm font-medium">
            <p>Total Products: {data.total_products}</p>
            <p className="pr-36">
              Total Value: <span className="font-semibold text-green-600">৳{data.total_value}</span>
            </p>
          </div>
        </div>
      ) : (
        selectedBatchId &&
        !isLoading &&
        !error && <div className="text-gray-500">No products found for selected batch</div>
      )}
    </div>
  )
}