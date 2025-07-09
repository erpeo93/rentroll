import React from "react";
import { Product } from "../types/product";

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "6px",
      padding: "1rem",
      width: "200px",
      margin: "0.5rem"
    }}>
      <h3>{product.name}</h3>
      <p>🎮 {product.category}</p>
      <p>💰 Value: ${product.value}</p>
    </div>
  );
};

export default ProductCard;