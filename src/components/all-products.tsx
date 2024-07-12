import Image from "next/image"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export function AllProducts() {
    return (
        <div className="flex flex-col text-black">
            <Card
                className="overflow-hidden bg-primary text-black"
            >
                <CardHeader>
                    <a href="asd"><CardTitle>Lorem ipsum</CardTitle></a>
                    <CardDescription className="text-black">
                        Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 text-black">
                        <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="300"
                            src="/testproduct.jpg"
                            width="300"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
