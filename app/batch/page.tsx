// 'use client'
// import { useBatchIdSearchQuery } from '@/redux/feature/stockSlice'
// import React, { useState, useMemo } from 'react'

// export default function Batch() {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [batchId, setBatchId] = useState('');
//     const { data, isLoading, error } = useBatchIdSearchQuery(searchQuery);
//     console.log("Batch Data:", searchQuery, data);

//     // Handle form submission
//     const handleSearch = (e) => {
//         e.preventDefault();
//         setBatchId(searchQuery.trim());
//     };


//     return (
//         <div className="p-4">
//             {/* Search Input Form */}
//             <form onSubmit={handleSearch} className="mb-4">
//                 <div className="flex gap-2">
//                     <input
//                         type="text"
//                         placeholder="Enter Batch ID"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full max-w-md text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                     >
//                         Search
//                     </button>
//                 </div>
//             </form>

//             {/* Loading and Error States */}
//             {isLoading && <div>Loading...</div>}
//             {error && <div className="text-red-500">Error loading data</div>}

//             {/* Batch Info and Table (shown only when data exists) */}
//             {data && (
//                 <div>
                   

//                     <div className="overflow-x-auto">
//                         <table className="min-w-full border-collapse border border-gray-300">
//                             <thead>
//                                 <tr className="">
//                                     <th className="border border-gray-300 p-2 text-left">ID</th>
//                                     <th className="border border-gray-300 p-2 text-left">Product</th>
//                                     <th className="border border-gray-300 p-2 text-left">Stock</th>
//                                     <th className="border border-gray-300 p-2 text-left">Cost Price</th>
//                                     <th className="border border-gray-300 p-2 text-left">MRP</th>
//                                     <th className="border border-gray-300 p-2 text-left">Selling Price</th>
//                                     <th className="border border-gray-300 p-2 text-left">Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data?.products?.map(product => (
//                                     <tr key={product.id} className="">
//                                         <td className="border border-gray-300 p-2">{product.id}</td>
//                                         <td className="border border-gray-300 p-2">{product.product}</td>
//                                         <td className="border border-gray-300 p-2">{product.stock}</td>
//                                         <td className="border border-gray-300 p-2">৳
//                                             {product.cost_price}</td>
//                                         <td className="border border-gray-300 p-2">
//                                             {product.mrp}</td>
//                                         <td className="border border-gray-300 p-2">৳
//                                             {product.selling_price}</td>
//                                         <td className="border border-gray-300 p-2">৳
//                                             {product.total}</td>
//                                     </tr>
//                                 ))}

//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

'use client'
import { useBatchIdSearchQuery } from '@/redux/feature/stockSlice'
import React, { useState } from 'react'

export default function Batch() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading, error } = useBatchIdSearchQuery(searchQuery, {
    skip: !searchQuery.trim(), // prevent unnecessary queries
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchQuery.trim())
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
      </form>

      {/* Loading and Error States */}
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error loading data</div>}

      {/* Show data when available */}
      {data?.products?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="">
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
        </div>
      ) : (
        searchQuery &&
        !isLoading &&
        !error && <div className="text-gray-500">No results found</div>
      )}
    </div>
  )
}
