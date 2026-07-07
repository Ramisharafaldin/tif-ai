# Inventory Analysis Skill

## Description
Analyzes inventory levels across branches, classifies products by stock status (overstocked, normal, low, out_of_stock), and generates alerts.

## Input
- `branch_id`: optional str — filter by branch
- `category`: optional str — filter by category

## Output
- `summary`: dict — total products, stock value, items count, overstocked/low/out counts
- `items`: list of dict — each product with stock status
- `alerts`: list of dict — overstock, low stock, out-of-stock alerts

## Used By
- InventoryIntelligenceAgent
