import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { slug } = await params;
    const { rating, content, title } = await request.json();

    if (!rating || !content) {
      return NextResponse.json(
        { error: "Rating and content are required" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newReview = {
      userId: (session.user as any).id,
      author: session.user.name || "Anonymous",
      rating: Number(rating),
      content,
      title: title || "",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Add review
    product.reviews.push(newReview);

    // Recalculate rating and review count
    const totalRating = product.reviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );
    product.reviewCount = product.reviews.length;
    product.rating = totalRating / product.reviewCount;

    await product.save();

    // Map database structure to frontend structure before returning
    const mappedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.categories && product.categories.length > 0 ? product.categories[0] : 'Uncategorized',
      categories: product.categories || [],
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      stock: product.stock,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      isNew: product.isNewProduct || false,
      isFeatured: product.isFeatured || false,
      images: product.images && product.images.length > 0 
        ? product.images.map((img: any) => img.url)
        : ["/placeholder.svg?height=600&width=600"],
      rawImages: product.images || [],
      description: product.description,
      longDescription: product.longDescription,
      variations: product.variations || {},
      specifications: product.specifications || {},
      reviews: product.reviews || []
    };

    return NextResponse.json(
      { message: "Review added successfully", review: newReview, product: mappedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}
