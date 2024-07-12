import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Minus
} from "lucide-react"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
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

export default function SavedItemsList({ showSavedItems, setShowSavedItems }: any) {
    const { savedItems, removeItem } = useSavedItems();
    return (
        <Table className="">
            <TableCaption className="mb-3">Delete articles with &quot;-&quot;</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead><Button size="sm" variant="outline" className="bg-background hover:bg-muted/40 text-muted-foreground" onClick={() => setShowSavedItems(showSavedItems === false)}>
                        Back to all products<ChevronLeft className="h-4 w-4" />
                    </Button></TableHead>
                    <TableHead className="w-[100px]">Articel ID</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {savedItems.map((invoice, index) => (
                    <TableRow key={invoice.invoice} className={index % 2 === 1 ? 'bg-muted/20' : ''}>
                        <TableCell className="hidden sm:table-cell">
                            <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src="/testproduct.jpg"
                                width="64"
                            />
                        </TableCell>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.quantity}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(invoice.invoice)}>
                                <Minus className="h-4 w-4" />
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
    )
} 