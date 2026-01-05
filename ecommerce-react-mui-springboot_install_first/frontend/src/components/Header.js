import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { items } = useCart();

  const totalCount = items.reduce(
    (sum, it) => sum + (it.quantity || 1),
    0
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Ecomm Demo
        </Typography>
        <IconButton
          color="inherit"
          aria-label="cart"
          component={Link}
          to="/checkout"
        >
          <Badge badgeContent={totalCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
