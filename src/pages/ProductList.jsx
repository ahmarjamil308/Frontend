import ProductItem from "../components/ProductItem";
import products from "../data/products";

const ProductList = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <ProductItem key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
