'use client'
import { useBatchIdSearchapiQuery } from '@/redux/feature/stockSlice'
import React, { useState } from 'react'

interface Product {
  id: number
  product: string
  stock: number
  cost_price: string
  mrp: string
  selling_price: string
  total: string
  created_on: string
}

interface BatchEntry {
  batch_id: string
  products: Product[]
  total_products: number
  total_value: string
}

interface BatchSearchResponse {
  start_date: string
  end_date: string
  grand_total_products: number
  grand_total_value: string
  batches: BatchEntry[]
}

export default function Batch() {
  const today = new Date().toISOString().split('T')[0]
  const firstOfYear = `${new Date().getFullYear()}-01-01`

  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(firstOfYear)
  const [endDate, setEndDate] = useState(today)
  const [activeFilter, setActiveFilter] = useState<{ q: string; start_date: string; end_date: string } | null>(null)

  const { data: raw, isLoading: isBatchLoading, error: batchError } = useBatchIdSearchapiQuery(
    activeFilter ?? { q: '', start_date: '', end_date: '' },
    { skip: !activeFilter }
  ) as { data: BatchSearchResponse | undefined; isLoading: boolean; error: unknown }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveFilter({ q: searchQuery.trim(), start_date: startDate, end_date: endDate })
  }

  const handleReset = () => {
    setSearchQuery('')
    setStartDate(firstOfYear)
    setEndDate(today)
    setActiveFilter(null)
  }

  const showResults = !!activeFilter

  const tableRows = raw?.batches?.flatMap((batch) =>
    batch.products.map((product) => ({
      batch_id: batch.batch_id,
      total_products: batch.total_products,
      batch_total_value: batch.total_value,
      ...product,
    }))
  ) ?? []

  const formatPrintDate = (value: string) =>
    new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const handlePrint = () => {
    if (!tableRows.length) {
      return
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800')

    if (!printWindow) {
      return
    }

    const tableMarkup = tableRows
      .map(
        (row) => `
          <tr>
            <td>${row.batch_id}</td>
            <td>${row.id}</td>
            <td>${row.product}</td>
            <td class="text-right">${row.stock}</td>
            <td class="text-right">BDT ${row.cost_price}</td>
            <td class="text-right">BDT ${row.mrp}</td>
            <td class="text-right">BDT ${row.selling_price}</td>
            <td class="text-right total">BDT ${row.total}</td>
            <td class="text-right">${formatPrintDate(row.created_on)}</td>
          </tr>
        `
      )
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Batch Table Print</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, Helvetica, sans-serif;
              color: #0f172a;
              background: #ffffff;
            }

            .header {
              margin-block-end: 20px;
            }

            .title {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }

            .subtitle {
              margin: 6px 0 0;
              font-size: 13px;
              color: #475569;
            }

            .meta,
            .summary {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              margin-block-end: 16px;
            }

            .chip {
              border: 1px solid #cbd5e1;
              border-radius: 999px;
              padding: 8px 12px;
              font-size: 12px;
              background: #f8fafc;
            }

            table {
              inline-size: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              border: 1px solid #cbd5e1;
              padding: 10px 12px;
              font-size: 12px;
              vertical-align: top;
            }

            th {
              background: #e2e8f0;
              text-align: start;
              font-weight: 700;
            }

            .text-right {
              text-align: end;
            }

            .total {
              font-weight: 700;
            }

            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Batch Table Report</h1>
            <p class="subtitle">Printed batch list with current search filters and totals.</p>
          </div>

          <div class="meta">
            <div class="chip">Start Date: ${activeFilter?.start_date ?? '-'}</div>
            <div class="chip">End Date: ${activeFilter?.end_date ?? '-'}</div>
            <div class="chip">Query: ${activeFilter?.q || 'All batches'}</div>
          </div>

          <div class="summary">
            <div class="chip">Total Batches: ${raw?.batches?.length ?? 0}</div>
            <div class="chip">Grand Total Products: ${raw?.grand_total_products ?? 0}</div>
            <div class="chip">Grand Total Value: BDT ${raw?.grand_total_value ?? '0.00'}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Product ID</th>
                <th>Product</th>
                <th class="text-right">Stock</th>
                <th class="text-right">Cost Price</th>
                <th class="text-right">MRP</th>
                <th class="text-right">Sell Price</th>
                <th class="text-right">Total</th>
                <th class="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableMarkup}
            </tbody>
          </table>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="mx-auto container">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100 md:text-3xl">Batch Management</h1>
          <p className="mt-1 text-sm text-slate-400">Search and filter batches by date range and batch ID</p>
        </div>

        {/* Filter Card */}
        <div className="mb-6 rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-xl backdrop-blur md:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Search Filters</h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Start Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Search Query */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-400">Batch ID / Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. bat, uuid..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-95"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Active filter summary */}
            {activeFilter && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                {activeFilter.start_date && (
                  <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1">
                    From: <span className="text-slate-200">{activeFilter.start_date}</span>
                  </span>
                )}
                {activeFilter.end_date && (
                  <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1">
                    To: <span className="text-slate-200">{activeFilter.end_date}</span>
                  </span>
                )}
                {activeFilter.q && (
                  <span className="rounded-full border border-cyan-600/40 bg-cyan-500/10 px-3 py-1 text-cyan-300">
                    Query: {activeFilter.q}
                  </span>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Grand Summary Bar */}
        {showResults && raw && (
          <div className="mb-4 flex flex-wrap gap-4 rounded-xl border border-slate-700/50 bg-slate-800/60 px-5 py-3">
            <p className="text-sm text-slate-400">
              Total Batches: <span className="font-semibold text-slate-100">{raw.batches?.length ?? 0}</span>
            </p>
            <p className="text-sm text-slate-400">
              Grand Total Products: <span className="font-semibold text-slate-100">{raw.grand_total_products}</span>
            </p>
            <p className="text-sm text-slate-400">
              Grand Total Value: <span className="font-bold text-emerald-400">৳{raw.grand_total_value}</span>
            </p>
            <button
              type="button"
              onClick={handlePrint}
              className="ml-auto rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
              disabled={!tableRows.length}
            >
              Print Table
            </button>
          </div>
        )}

        {/* Batch Table Results */}
        {showResults && (
          <div className="mb-6 rounded-xl border border-slate-700/60 bg-slate-900/70 shadow-xl backdrop-blur">
            <div className="border-b border-slate-700/60 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-100">Batch Table</h2>
            </div>
            <div className="p-4">
              {isBatchLoading && (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800" />
                  ))}
                </div>
              )}
              {Boolean(batchError) ? (
                <p className="text-sm text-red-400">Error loading batches. Please try again.</p>
              ) : null}
              {!isBatchLoading && !batchError && raw?.batches?.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">No batches found for the selected filters.</p>
              )}
              {!isBatchLoading && tableRows.length > 0 && (
                <>
                  <div className="overflow-x-auto rounded-lg border border-slate-700/60">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 bg-slate-800/80">
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Batch ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Product ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Stock</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Cost Price</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">MRP</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Sell Price</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Total</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, idx) => (
                          <tr
                            key={`${row.batch_id}-${row.id}`}
                            className={`border-b border-slate-700/50 transition hover:bg-slate-800/40 ${idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-800/20'}`}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-cyan-300">{row.batch_id}</td>
                            <td className="px-4 py-3 text-slate-400">{row.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-100">{row.product}</td>
                            <td className="px-4 py-3 text-right text-slate-200">{row.stock}</td>
                            <td className="px-4 py-3 text-right text-slate-200">৳{row.cost_price}</td>
                            <td className="px-4 py-3 text-right text-slate-200">৳{row.mrp}</td>
                            <td className="px-4 py-3 text-right text-slate-200">৳{row.selling_price}</td>
                            <td className="px-4 py-3 text-right font-semibold text-emerald-400">৳{row.total}</td>
                            <td className="px-4 py-3 text-right text-xs text-slate-400">
                              {formatPrintDate(row.created_on)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 px-5 py-3">
                    <p className="text-sm text-slate-400">
                      Total Batches: <span className="font-semibold text-slate-100">{raw?.batches?.length ?? 0}</span>
                    </p>
                    <p className="text-sm text-slate-400">
                      Grand Total Products: <span className="font-semibold text-slate-100">{raw?.grand_total_products ?? 0}</span>
                    </p>
                    <p className="text-sm text-slate-400">
                      Grand Total Value: <span className="text-lg font-bold text-emerald-400">৳{raw?.grand_total_value ?? '0.00'}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}