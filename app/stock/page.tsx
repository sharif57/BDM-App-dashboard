'use client';

import { useState } from "react";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    useCancelStockMutation,
    useConfirmStockMutation,
    useCreateStockMutation,
    useDeleteBatchMutation,
    useSearchProductQuery,
    useStockDataQuery,
} from "@/redux/feature/stockSlice";

type SearchProduct = {
    product_id: number;
    product_name: string;
    generic_name: string;
    stock_quantity: number;
    cost_price: number | string;
    selling_price: number | string;
    mrp: number | string;
};

type StockBatchProduct = {
    id: number;
    product: string;
    old_stock?: number;
    stock: number;
    cost_price: string;
    mrp: string;
    selling_price: string;
    total: string;
};

type StockBatchSummary = {
    batch_id?: string;
    products?: StockBatchProduct[];
    total_value?: string;
};

type SearchProductsResponse = {
    data?: SearchProduct[];
};

type MutationResponse = {
    batch_id?: string;
    message?: string;
};

type ApiError = {
    data?: {
        message?: string;
    };
};

export default function Stock() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<SearchProduct | null>(null);
    const [stock, setStock] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [stockData, setStockData] = useState<string | null>(null);
    const [mrp, setMrp] = useState("");
    const [stockQuantity, setStockQuantity] = useState<number>(0);

    const { data: searchResults } = useSearchProductQuery(searchQuery, {
        skip: !searchQuery,
    }) as { data?: SearchProductsResponse };
    const [createStock] = useCreateStockMutation();
    const [confirmStock] = useConfirmStockMutation();
    const [cancelStock] = useCancelStockMutation();
    const { data: stockDatas, refetch } = useStockDataQuery(stockData || "all") as {
        data?: StockBatchSummary;
        refetch: () => Promise<unknown>;
    };
    const [deleteBatch] = useDeleteBatchMutation();

    const handleProductSelect = (product: SearchProduct) => {
        setSelectedProduct(product);
        setSearchQuery(`${product.product_name} (${product.generic_name})`);
        setStock(product.stock_quantity.toString());
        setCostPrice(product.cost_price.toString());
        setSellingPrice(product.selling_price.toString());
        setMrp(product.mrp.toString());
    };

    const resetForm = () => {
        setSelectedProduct(null);
        setSearchQuery("");
        setStock("");
        setCostPrice("");
        setSellingPrice("");
        setMrp("");
        setStockQuantity(0);
    };

    const handleAddStock = async () => {
        if (!selectedProduct || !stock || !costPrice || !sellingPrice || !mrp) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (
            [stock, costPrice, sellingPrice, mrp].some((value) =>
                Number.isNaN(Number(value))
            )
        ) {
            toast.error("Stock, Cost Price, Selling Price, and MRP must be valid numbers.");
            return;
        }

        const stockDataPayload = {
            product_id: Number(selectedProduct.product_id),
            new_stock_quantity: Number(stockQuantity),
            new_cost_price: Number(costPrice),
            new_selling_price: Number(sellingPrice),
            mrp: Number(mrp),
        };

        try {
            const res = (await createStock(stockDataPayload).unwrap()) as MutationResponse;
            setStockData(res.batch_id || null);
            toast.success(res.message || "Stock added successfully!");
            await refetch();
            resetForm();
        } catch (error) {
            console.error("Failed to add stock:", error);
            toast.error((error as ApiError)?.data?.message || "Failed to add stock. Please try again.");
        }
    };

    const handleConfirmStock = async () => {
        if (!stockDatas?.batch_id) {
            toast.error("No valid batch ID available to confirm.");
            return;
        }

        try {
            const res = (await confirmStock(stockDatas.batch_id).unwrap()) as MutationResponse;
            toast.success(res.message || "Stock confirmed successfully!");
            await refetch();
            window.location.reload();
            setStockData(null);
        } catch (error) {
            console.error("Failed to confirm stock:", error);
            toast.error((error as ApiError)?.data?.message || "Failed to confirm stock. Please try again.");
        }
    };

    const handleCancelStock = async () => {
        if (!stockDatas?.batch_id) {
            toast.error("No valid batch ID available to cancel.");
            return;
        }

        try {
            const res = (await cancelStock(stockDatas.batch_id).unwrap()) as MutationResponse;
            toast.success(res.message || "Stock cancelled successfully!");
            await refetch();
            window.location.reload();
            setStockData(null);
        } catch (error) {
            console.error("Failed to cancel stock:", error);
            toast.error((error as ApiError)?.data?.message || "Failed to cancel stock. Please try again.");
        }
    };

    const handleRemoveProduct = async (item: StockBatchProduct) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete the stock item for ${item.product}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete item!",
            });

            if (result.isConfirmed) {
                const res = (await deleteBatch(item.id).unwrap()) as MutationResponse;
                toast.success(res.message || "Stock item deleted successfully!");
                await refetch();
                Swal.fire("Deleted!", "Stock item deleted successfully.", "success");
            }
        } catch (error) {
            console.error("Failed to delete stock item:", error);
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
                                if (!e.target.value) {
                                    setSelectedProduct(null);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="current-quantity" className="text-white">Current Quantity</Label>
                    <Input
                        id="current-quantity"
                        className="bg-[#2c2e34] text-white"
                        placeholder="Stock Quantity"
                        value={stock}
                        disabled
                        readOnly
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="stock-quantity" className="text-white">Stock Quantity</Label>
                    <Input
                        id="stock-quantity"
                        type="number"
                        className="bg-[#2c2e34] text-white"
                        placeholder="Stock Quantity"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(Number(e.target.value) || 0)}
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
                        onChange={(e) => setMrp(e.target.value)}
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

            {searchResults?.data?.length ? (
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
            ) : null}

            <p className="text-white text-end mt-4">Batch ID: {stockDatas?.batch_id}</p>
            <Table className="border-2 mt-10">
                <TableCaption>A list of your recent stock data.</TableCaption>
                <TableHeader>
                    <TableRow className="text-white">
                        <TableHead className="text-white text-xl">Product</TableHead>
                        <TableHead className="text-white text-xl">Old Stock</TableHead>
                        <TableHead className="text-white text-xl">Stock</TableHead>
                        <TableHead className="text-white text-xl">Cost Price</TableHead>
                        <TableHead className="text-white text-xl">MRP</TableHead>
                        <TableHead className="text-white text-xl">Selling Price</TableHead>
                        <TableHead className="text-white text-xl">Total</TableHead>
                        <TableHead className="text-white text-xl">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockDatas?.products?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.old_stock ?? 0}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>${item.cost_price}</TableCell>
                            <TableCell>{item.mrp}</TableCell>
                            <TableCell>${item.selling_price}</TableCell>
                            <TableCell>${item.total}</TableCell>
                            <TableCell>
                                <Trash
                                    className="cursor-pointer text-red-500"
                                    onClick={() => handleRemoveProduct(item)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>Total Value</TableCell>
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
