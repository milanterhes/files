import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useSavedItems } from "@/contexts/SavedItemsContext";

const invoices = [
    {

        invoice: "0205012080",
        paymentStatus: "3/5x3/5",
        quantity: "50p",
        totalAmount: "€250.00",
    },
    {

        invoice: "0205012070",
        paymentStatus: "3/5x3/5",
        quantity: "50p",
        totalAmount: "€250.00",
    },
    {

        invoice: "0205012060",
        paymentStatus: "3/5x3/5",
        quantity: "50p",
        totalAmount: "€250.00",
    },
    {

        invoice: "0205012050",
        paymentStatus: "3/5x3/5",
        quantity: "50p",
        totalAmount: "€250.00",
    },

]

export function SearchProductCard({ searchTerm }: any) {
    const { addItem } = useSavedItems();
    const [filteredInvoices, setFilteredInvoices] = useState(invoices);

    useEffect(() => {
        setFilteredInvoices(
            invoices.filter((invoice) =>
                invoice.invoice.toLowerCase().includes(searchTerm.toLowerCase().trim())
            )
        );
    }, [searchTerm]);

    return (
        <Card className="w-full border-y-2 border-x-0 text-background border-background bg-primary flex flex-col">
            <div className="flex flex-row justify-evenly">
                <CardTitle className="pt-6">Watering tap</CardTitle>
                <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="84"
                    src="/testproduct.jpg"
                    width="84"
                />
            </div>
            <Table>
                <TableCaption className="mb-3">Save articles with &quot;+&quot;</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Article ID</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice, index) => (
                        <TableRow key={invoice.invoice} className={index % 2 === 1 ? 'bg-muted/20' : ''}>
                            <TableCell className="font-medium">{invoice.invoice}</TableCell>
                            <TableCell>{invoice.paymentStatus}</TableCell>
                            <TableCell>{invoice.quantity}</TableCell>
                            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => addItem(invoice)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </Card>
    );
}
