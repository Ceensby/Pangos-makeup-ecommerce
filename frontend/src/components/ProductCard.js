import React from "react";
import { formatTRY } from "../utils/formatPrice";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../config";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const { add } = useCart();
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                maxWidth: 345,
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={resolveImageUrl(product.imageUrl)}
                alt={product.name}
                sx={{ objectFit: "contain", p: 2, bgcolor: "#f9f9f9" }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                    {product.name}
                </Typography>

                <Typography variant="caption" display="block" color="text.secondary">
                    ID: {product.id ?? "MISSING"}
                </Typography>

                <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ mt: 1, fontWeight: "bold" }}
                >
                    {formatTRY(product.price)}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();

                        if (!product?.id) {
                            alert("Error: Product has no ID!");
                            console.error("Product without ID:", product);
                            return;
                        }

                        console.log("Adding product to cart:", product);
                        add(product);
                    }}
                >
                    Add to Cart
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/products/${product.id}`)}
                    sx={{ ml: 1 }}
                >
                    View
                </Button>
            </CardActions>
        </Card>
    );
}