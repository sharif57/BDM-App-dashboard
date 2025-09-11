
'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useAllStockProductsQuery, useConfirmStockMutation, useCreateStockMutation, useStockDataQuery, useCancelStockMutation, useSearchProductQuery } from "@/redux/feature/stockSlice";
import { useState } from "react";
import { toast } from "sonner";

export default function Stock() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stock, setStock] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [stockData, setStockData] = useState(null);
    const [mrp, setMrp] = useState("");

    const { data: products } = useAllStockProductsQuery(undefined);
    const { data: searchResults } = useSearchProductQuery(searchQuery, { skip: !searchQuery });
    const [createStock] = useCreateStockMutation();
    const [confirmStock] = useConfirmStockMutation();
    const [cancelStock] = useCancelStockMutation();
    const { data: stockDatas, refetch } = useStockDataQuery(stockData || "all");
    console.log("Stock Data:", stockDatas);

    const handleSearch = () => {
        if (!searchQuery) {
            toast.error("Please enter a product name to search.");
            return;
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSearchQuery(`${product.product_name} (${product.generic_name})`);
        setStock(product.stock_quantity.toString());
        setCostPrice(product.cost_price.toString());
        setSellingPrice(product.selling_price.toString());
        setMrp(product.mrp.toString()); 
    };

    const handleAddStock = async () => {
        if (!selectedProduct || !stock || !costPrice || !sellingPrice) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (isNaN(Number(stock)) || isNaN(Number(costPrice)) || isNaN(Number(sellingPrice))) {
            toast.error("Stock, Cost Price, and Selling Price must be valid numbers.");
            return;
        }

        const stockDataPayload = {
            product_id: Number(selectedProduct.product_id),
            new_stock_quantity: Number(stock),
            new_cost_price: Number(costPrice),
            new_selling_price: Number(sellingPrice),
            mrp: Number(mrp),
        };

        try {
            const res = await createStock(stockDataPayload).unwrap();
            console.log("Stock added successfully:", res);
            setStockData(res?.batch_id);
            toast.success(res.message || "Stock added successfully!");
            await refetch();
            setSelectedProduct(null);
            setStock("");
            setCostPrice("");
            setSellingPrice("");
            setSearchQuery("");

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
            await refetch();
            window.location.reload();
            setStockData(null);
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
            await refetch();
            window.location.reload();
            setStockData(null);
        } catch (error) {
            console.error("Failed to cancel stock:", error);
            toast.error(error?.data?.message || "Failed to cancel stock. Please try again.");
        }
    };

    return (
        <div>
            <div className="lg:flex justify-between items-center w-full gap-8 mt-8">
                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="search-product" className="text-white">Search Product</Label>
                    <div className="flex gap-4">
                        <Input
                            id="search-product"
                            className="bg-[#2c2e34] text-white"
                            placeholder="Search Product"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (!e.target.value) setSelectedProduct(null); // Clear selection if search is cleared
                            }}
                        />
                       
                    </div>
                </div>
                <div className="w-full flex  flex-col gap-2">
                    <Label htmlFor="stock-quantity" className="text-white">Current Quantity</Label>
                    <Input
                        id="stock-quantity"
                        className="bg-[#2c2e34] text-white"
                        placeholder="Stock Quantity"
                        value={stock}
                        disabled
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                <div className="w-full flex  flex-col gap-2">
                    <Label htmlFor="stock-quantity" className="text-white">Stock Quantity</Label>
                    <Input
                        id="stock-quantity"
                        className="bg-[#2c2e34] text-white"
                        placeholder="Stock Quantity"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="cost-price" className="text-white">Cost Price</Label>
                    <Input
                        id="cost-price"
                        className="bg-[#2c2e34] text-white"
                        placeholder="Cost Price"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="mrp" className="text-white">MRP</Label>
                    <Input
                        id="mrp"
                        className="bg-[#2c2e34] text-white"
                        placeholder="MRP"
                        value={mrp}
                        onChange={(e) => setCostPrice(e.target.value)}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="selling-price" className="text-white">Selling Price</Label>
                    <Input
                        id="selling-price"
                        className="bg-[#2c2e34] text-white"
                        placeholder="Selling Price"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                    />
                </div>
                <div className="flex justify-center mt-4 items-end">
                    <Button
                        className="bg-green-500 text-black hover:bg-green-400"
                        onClick={handleAddStock}
                    >
                        Add Stock
                    </Button>
                </div>
            </div>
            {searchResults?.data?.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto bg-[#2c2e34] p-4 rounded">
                    {searchResults.data.map((product) => (
                        <div
                            key={product.product_id}
                            className="p-2 hover:bg-gray-700 cursor-pointer text-white"
                            onClick={() => handleProductSelect(product)}
                        >
                            {product.product_name} ({product.generic_name})
                        </div>
                    ))}
                </div>
            )}
            <p className="text-white text-end mt-4">Batch ID: {stockDatas?.batch_id}</p>
            <Table className="border-2 mt-10">
                <TableCaption>A list of your recent stock data.</TableCaption>
                <TableHeader>
                    <TableRow className="text-white">
                        <TableHead className="text-white text-xl">Product</TableHead>
                        <TableHead className="text-white text-xl">Stock</TableHead>
                        <TableHead className="text-white text-xl">Cost Price</TableHead>
                        <TableHead className="text-white text-xl">MRP</TableHead>
                        <TableHead className="text-white text-xl">Selling Price</TableHead>
                        <TableHead className="text-white text-xl">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockDatas?.products?.map((item) => (
                        <TableRow key={item.id}>
                            {/* <TableCell>{stockDatas.batch_id}</TableCell> */}
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>${item.cost_price}</TableCell>
                            <TableCell>{item?.mrp}</TableCell>
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