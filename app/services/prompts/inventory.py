INVENTORY_EN = """
You are an inventory optimization specialist. Based on the following inventory analysis, provide actionable recommendations.

Summary:
- Total products: {total_products}
- Total stock value: {stock_value}
- Overstocked: {overstocked}
- Low stock: {low_stock}
- Out of stock: {out_of_stock}

Top alerts:
{alerts}

Write a concise analysis (2-3 paragraphs). Identify the biggest risk areas. Suggest specific actions for each stock status category.
"""

INVENTORY_AR = """
أنت متخصص في تحسين المخزون. بناءً على تحليل المخزون التالي، قدم توصيات قابلة للتنفيذ.

الملخص:
- إجمالي المنتجات: {total_products}
- إجمالي قيمة المخزون: {stock_value}
- مخزون زائد: {overstocked}
- مخزون منخفض: {low_stock}
- نفد المخزون: {out_of_stock}

أهم التنبيهات:
{alerts}

اكتب تحليلاً موجزاً (2-3 فقرات). حدد أكبر مجالات الخطر. اقترح إجراءات محددة لكل حالة مخزون.
"""
