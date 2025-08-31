'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAllStockProductsQuery, useConfirmStockMutation, useCreateStockMutation, useStockDataQuery, useCancelStockMutation } from "@/redux/feature/stockSlice";
import { useState } from "react";
import { toast } from "sonner";

export default function Stock() {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [stock, setStock] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [stockData, setStockData] = useState(null);

    const { data: products } = useAllStockProductsQuery(undefined);
    const [createStock] = useCreateStockMutation();
    const [confirmStock] = useConfirmStockMutation();
    const [cancelStock] = useCancelStockMutation();
    const { data: stockDatas, refetch } = useStockDataQuery(stockData || "all"); // Fallback to "all" for initial fetch

    console.log("Stock Data:", stockDatas);

    const handleAddStock = async () => {
        // Basic validation
        if (!selectedProduct || !stock || !costPrice || !sellingPrice) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (isNaN(Number(stock)) || isNaN(Number(costPrice)) || isNaN(Number(sellingPrice))) {
            toast.error("Stock, Cost Price, and Selling Price must be valid numbers.");
            return;
        }

        const stockDataPayload = {
            product_id: Number(selectedProduct),
            new_stock_quantity: Number(stock),
            new_cost_price: Number(costPrice),
            new_selling_price: Number(sellingPrice),
        };

        try {
            const res = await createStock(stockDataPayload).unwrap();
            console.log("Stock added successfully:", res);
            setStockData(res?.batch_id); // Trigger useStockDataQuery with new batch_id
            toast.success(res.message || "Stock added successfully!");
            await refetch(); // Refresh table data
            // Reset form
            setSelectedProduct("");
            setStock("");
            setCostPrice("");
            setSellingPrice("");
        } catch (error) {
            console.error("Failed to add stock:", error);
            toast.error(error?.data?.message || "Failed to add stock. Please try again.");
        }
    };

    const handleConfirmStock = async () => {
        if (!stockDatas?.batch_id || typeof stockDatas.batch_id !== "string") {
            toast.error("No valid batch ID available to confirm.");
            return;
        }

        try {
            const res = await confirmStock(stockDatas.batch_id).unwrap();
            console.log("Stock confirmed successfully:", res);
            toast.success(res.message || "Stock confirmed successfully!");
            await refetch(); // Refresh table data
            window.location.reload();
            setStockData(null); // Optionally clear stockData to show all batches
        } catch (error) {
            console.error("Failed to confirm stock:", error);
            toast.error(error?.data?.message || "Failed to confirm stock. Please try again.");
        }
    };

    const handleCancelStock = async () => {
        if (!stockDatas?.batch_id || typeof stockDatas.batch_id !== "string") {
            toast.error("No valid batch ID available to cancel.");
            return;
        }

        try {
            const res = await cancelStock(stockDatas.batch_id).unwrap();
            console.log("Stock cancelled successfully:", res);
            toast.success(res.message || "Stock cancelled successfully!");
            await refetch(); // Refresh table data
            window.location.reload();
            setStockData(null); // Optionally clear stockData to show all batches
        } catch (error) {
            console.error("Failed to cancel stock:", error);
            toast.error(error?.data?.message || "Failed to cancel stock. Please try again.");
        }
    };

    return (
        <div>
            <div className="lg:flex justify-between items-center w-full gap-8 mt-8">
                <div className="w-full">
                    <Select
                        value={selectedProduct}
                        onValueChange={(value) => setSelectedProduct(value)}
                    >
                        <SelectTrigger className="bg-[#2c2e34]">
                            <SelectValue placeholder="Select a Product" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2c2e34] w-full text-white">
                            {products?.results?.data?.map((product) => (
                                <SelectItem
                                    key={product.product_id}
                                    value={product.product_id.toString()}
                                >
                                    {product.product_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full">
                    <Input
                        className="bg-[#2c2e34] w-full text-white"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <Input
                        className="bg-[#2c2e34] text-white"
                        placeholder="Cost Price"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <Input
                        className="bg-[#2c2e34] text-white"
                        placeholder="Selling Price"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                    />
                </div>
                <div>
                    <Button
                        className="bg-green-500 text-black hover:bg-green-400"
                        onClick={handleAddStock}
                    >
                        Add Stock
                    </Button>
                </div>
            </div>
            <Table className="border-2 mt-10">
                <TableCaption>A list of your recent stock data.</TableCaption>
                <TableHeader>
                    <TableRow className="text-white">
                        <TableHead className="text-white text-xl">Batch ID</TableHead>
                        <TableHead className="text-white text-xl">Product</TableHead>
                        <TableHead className="text-white text-xl">Stock</TableHead>
                        <TableHead className="text-white text-xl">Cost Price</TableHead>
                        <TableHead className="text-white text-xl">Selling Price</TableHead>
                        <TableHead className="text-white text-xl">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockDatas?.products?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{stockDatas.batch_id}</TableCell>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>${item.cost_price}</TableCell>
                            <TableCell>${item.selling_price}</TableCell>
                            <TableCell>${item.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total Value</TableCell>
                        <TableCell>${stockDatas?.total_value || "0.00"}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="fixed bottom-4 right-4 flex gap-4">
                <Button
                    className="bg-red-500 px-6 py-2 w-full text-black hover:bg-red-400"
                    onClick={handleCancelStock}
                >
                    Cancel
                </Button>
                <Button
                    className="bg-green-500 px-6 py-2 w-full text-black hover:bg-green-400"
                    onClick={handleConfirmStock}
                >
                    Confirm Add Product
                </Button>
            </div>
        </div>
    );
}