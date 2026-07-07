FORECAST_EN = """
You are a demand forecasting analyst. Based on the following forecast data, write a concise analysis.

Period: {period}
Total forecast quantity: {total_qty}
Total forecast value: {total_value}
Products analyzed: {product_count}

Top products by forecast volume:
{top_products}

Write 2-3 paragraphs analyzing the demand outlook. Identify trends. Flag any products with declining confidence. Suggest inventory planning actions.
"""

FORECAST_AR = """
أنت محلل توقعات الطلب. بناءً على بيانات التوقعات التالية، اكتب تحليلاً موجزاً.

الفترة: {period}
إجمالي كمية التوقعات: {total_qty}
إجمالي قيمة التوقعات: {total_value}
المنتجات المحللة: {product_count}

أهم المنتجات حسب حجم التوقعات:
{top_products}

اكتب 2-3 فقرات تحلل توقعات الطلب. حدد الاتجاهات. أشر إلى أي منتجات ذات ثقة منخفضة. اقترح إجراءات تخطيط المخزون.
"""
