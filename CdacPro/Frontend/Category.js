import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .get("http://localhost:5050/admin/getAllCategories", config)
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No categories");
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading categories...</p>;

  if (error)
    return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.categoryId}
            onClick={() => handleCategoryClick(category.categoryId)}
            style={{
              cursor: "pointer",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "center",
              padding: "16px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={`data:image/png;base64,${category.image}`}
              alt={category.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <p
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                margin: "0",
                color: "#333",
              }}
            >
              {category.name}
            </p>
          </div>
        ))
      ) : (
        <p style={{ gridColumn: "1/-1", textAlign: "center" }}>No categories found</p>
      )}
    </div>
  );
}

export default Category;
