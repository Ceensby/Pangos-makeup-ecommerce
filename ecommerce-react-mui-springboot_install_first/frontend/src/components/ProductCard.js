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
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    const { add } = useCart();

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={resolveImageUrl(product.imageUrl)}
                alt={product.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {formatTRY(product.price)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => add(product)}>
                    Add to cart
                </Button>
                <Button
                    size="small"
                    component={Link}
                    to={`/products/${product.id}`}>
                    View
                </Button>
            </CardActions>
        </Card >
    );
}
