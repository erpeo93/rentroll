import React from "react";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

const SuggestionPanel: React.FC<Props> = ({ products }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SuggestionPanel;