interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  sellerId: string;
}

export default Product;
