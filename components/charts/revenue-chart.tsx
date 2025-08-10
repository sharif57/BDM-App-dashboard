// "use client"

// import { useAllDashboardQuery } from "@/redux/feature/dashboardSlice"
// import { useEffect, useRef } from "react"

// export default function RevenueChart() {

//     const {data: dashboard} =useAllDashboardQuery(undefined)
//     console.log("dashboard",dashboard?.data)

//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     const resizeCanvas = () => {
//       const rect = canvas.getBoundingClientRect()
//       const dpr = window.devicePixelRatio || 1

//       canvas.width = rect.width * dpr
//       canvas.height = rect.height * dpr
//       ctx.scale(dpr, dpr)

//       const width = rect.width
//       const height = rect.height

//       // Clear canvas
//       ctx.clearRect(0, 0, width, height)

//       // Draw legend
//       const legendSize = Math.max(8, width * 0.02)
//       ctx.fillStyle = "#3C55A5"
//       ctx.fillRect(10, 10, legendSize, legendSize)
//       ctx.fillStyle = "#FFFFFF"
//       ctx.font = `${Math.max(10, width * 0.025)}px sans-serif`
//       ctx.fillText("Profit", 10 + legendSize + 8, 10 + legendSize)

//       ctx.fillStyle = "#6B7280"
//       ctx.fillRect(10 + legendSize + 50, 10, legendSize, legendSize)
//       ctx.fillStyle = "#FFFFFF"
//       ctx.fillText("Loss", 10 + legendSize + 58, 10 + legendSize)

//       // Draw y-axis labels
//       ctx.fillStyle = "#FFFFFF"
//       ctx.font = `${Math.max(8, width * 0.02)}px sans-serif`
//       const yLabels = ["100k", "80k", "50k", "20k", "0"]
//       yLabels.forEach((label, i) => {
//         const y = 40 + ((height - 60) / 4) * i
//         ctx.fillText(label, 5, y)
//       })

//       // Draw x-axis labels
//       const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
//       const barWidth = Math.max(8, width * 0.025)
//       const groupWidth = barWidth * 2 + 2
//       const spacing = (width - 60) / xLabels.length

//       xLabels.forEach((label, i) => {
//         const x = 40 + i * spacing
//         ctx.fillText(label, x - 5, height - 5)
//       })

//       // Draw bars
//       const profitData = [60, 80, 70, 90, 40, 85, 50, 75, 65]
//       const lossData = [40, 60, 50, 70, 30, 65, 35, 55, 45]
//       const maxValue = 100

//       profitData.forEach((profit, i) => {
//         const loss = lossData[i]
//         const x = 40 + i * spacing - groupWidth / 2

//         // Profit bar (blue)
//         const profitHeight = (profit / maxValue) * (height - 80)
//         const profitY = height - 20 - profitHeight
//         ctx.fillStyle = "#3C55A5"
//         ctx.fillRect(x, profitY, barWidth, profitHeight)

//         // Loss bar (gray)
//         const lossHeight = (loss / maxValue) * (height - 80)
//         const lossY = height - 20 - lossHeight
//         ctx.fillStyle = "#FFFFFF"
//         ctx.fillRect(x + barWidth + 2, lossY, barWidth, lossHeight)
//       })
//     }

//     resizeCanvas()
//     window.addEventListener("resize", resizeCanvas)

//     return () => window.removeEventListener("resize", resizeCanvas)
//   }, [])

//   return (
//     <div className="w-full h-40 sm:h-44 lg:h-48 relative">
//       <canvas ref={canvasRef} className="w-full h-full" />
//     </div>
//   )
// }
"use client"

import { useAllDashboardQuery } from "@/redux/feature/dashboardSlice"
import { useEffect, useRef } from "react"

export default function RevenueChart() {
    const {data: dashboard} = useAllDashboardQuery(undefined)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1

            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx.scale(dpr, dpr)

            const width = rect.width
            const height = rect.height

            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Draw legend
            const legendSize = Math.max(8, width * 0.02)
            ctx.fillStyle = "#3C55A5"
            ctx.fillRect(10, 10, legendSize, legendSize)
            ctx.fillStyle = "#FFFFFF"
            ctx.font = `${Math.max(10, width * 0.025)}px sans-serif`
            ctx.fillText("Revenue", 10 + legendSize + 8, 10 + legendSize)

            ctx.fillStyle = "#6B7280"
            ctx.fillRect(10 + legendSize + 80, 10, legendSize, legendSize)
            ctx.fillStyle = "#FFFFFF"
            ctx.fillText("Profit", 10 + legendSize + 88, 10 + legendSize)

            // Prepare data from API
            const salesData = dashboard?.data?.sales_by_month || []
            const profitData = dashboard?.data?.profit_by_month || []
            
            // Get all unique months from both datasets
            const allMonths = Array.from(
                new Set([
                    ...salesData.map(item => item.month),
                    ...profitData.map(item => item.month)
                ])
            ).sort((a, b) => {
                // Simple month sorting - for better results you might want to use actual dates
                const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                return monthsOrder.indexOf(a) - monthsOrder.indexOf(b)
            })

            // Find max value for scaling
            const maxSales = Math.max(...salesData.map(item => item.total_sales || 0), 100)
            const maxProfit = Math.max(...profitData.map(item => item.revenue || 0), 100)
            const maxValue = Math.max(maxSales, maxProfit) * 1.2 // Add 20% padding

            // Draw y-axis labels
            ctx.fillStyle = "#FFFFFF"
            ctx.font = `${Math.max(8, width * 0.02)}px sans-serif`
            const yLabels = [
                `${Math.round(maxValue / 1000)}k`,
                `${Math.round((maxValue * 0.8) / 1000)}k`,
                `${Math.round((maxValue * 0.6) / 1000)}k`,
                `${Math.round((maxValue * 0.4) / 1000)}k`,
                `${Math.round((maxValue * 0.2) / 1000)}k`,
                "0"
            ]
            yLabels.forEach((label, i) => {
                const y = 40 + ((height - 60) / (yLabels.length - 1)) * i
                ctx.fillText(label, 5, y)
            })

            // Draw x-axis labels and bars
            const barWidth = Math.max(8, width * 0.025)
            const groupWidth = barWidth * 2 + 2
            const spacing = (width - 60) / Math.max(1, allMonths.length)

            allMonths.forEach((month, i) => {
                const x = 40 + i * spacing
                
                // Draw month label
                ctx.fillText(month.substring(0, 3), x - 5, height - 5)

                // Get data for this month
                const salesItem = salesData.find(item => item.month === month)
                const profitItem = profitData.find(item => item.month === month)
                
                const salesValue = salesItem?.total_sales || 0
                const profitValue = profitItem?.revenue || 0

                // Draw bars
                const barX = x - groupWidth / 2

                // Sales bar (blue)
                const salesHeight = (salesValue / maxValue) * (height - 80)
                const salesY = height - 20 - salesHeight
                ctx.fillStyle = "#3C55A5"
                ctx.fillRect(barX, salesY, barWidth, salesHeight)

                // Profit bar (gray)
                const profitHeight = (profitValue / maxValue) * (height - 80)
                const profitY = height - 20 - profitHeight
                ctx.fillStyle = "#6B7280"
                ctx.fillRect(barX + barWidth + 2, profitY, barWidth, profitHeight)
            })
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        return () => window.removeEventListener("resize", resizeCanvas)
    }, [dashboard]) // Add dashboard to dependencies to redraw when data changes

    return (
        <div className="w-full h-40 sm:h-44 lg:h-48 relative">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    )
}