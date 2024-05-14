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
import { Product } from "@prisma/client";

interface ProductTableProps {
  products: Product[];
  total: number;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, total }) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Discount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.productId}>
            <TableCell className="font-medium">{product.productId}</TableCell>
            <TableCell>{product.productName}</TableCell>
            <TableCell>{product.listedPrice}</TableCell>
            <TableCell>{product.discount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total products in DB</TableCell>
          <TableCell>#{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ProductTable;
