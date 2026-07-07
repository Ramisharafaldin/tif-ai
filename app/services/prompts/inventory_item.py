INVENTORY_ITEM_EN = """
You are an inventory optimization specialist. Based on the EXACT data below, write ONE data-driven recommendation sentence.

Product: {product_name} (Code: {product_code})
Status: {status}
Current Stock: {current_stock} units
Average Daily Sales: {avg_daily_sales} units/day
Months of Stock Left: {months_of_stock}
Required Purchase Qty (calculated): {required_purchase_qty} units
Target Stock Days: {target_days}

CRITICAL RULES:
- You MUST use the EXACT numbers provided above in your recommendation.
- Do NOT invent or calculate your own numbers.
- If Required Purchase Qty is 0, state that no purchase is needed.
- If status is "out_of_stock", state that stock is depleted and recommend buying urgently using the Required Purchase Qty.
- If status is "low", state the remaining stock duration and recommend buying the exact Required Purchase Qty.
- If status is "overstocked", state how many months of stock exist and recommend reducing inventory (promotions, transfers).
- If status is "normal", state that stock is adequate and no action is needed.
- Output ONLY the recommendation sentence, nothing else.
"""

INVENTORY_ITEM_AR = """
أنت متخصص في تحسين المخزون. بناءً على البيانات التالية بالضبط، اكتب جملة توصية واحدة مبنية على الأرقام.

المنتج: {product_name} (الكود: {product_code})
الحالة: {status}
المخزون الحالي: {current_stock} وحدة
متوسط المبيعات اليومية: {avg_daily_sales} وحدة/يوم
أشهر المخزون المتبقية: {months_of_stock}
الكمية المطلوب شراؤها (محسوبة): {required_purchase_qty} وحدة
أيام المخزون المستهدفة: {target_days}

قواعد إلزامية:
- يجب استخدام الأرقام الواردة أعلاه بالضبط في التوصية.
- لا تخترع أو تحسب أرقاماً خاصة بك.
- إذا كانت الكمية المطلوب شراؤها 0، اذكر أن الشراء غير مطلوب.
- إذا كانت الحالة "out_of_stock"، اذكر أن المخزون نفد وأوصِ بشراء الكمية المطلوبة بشكل عاجل.
- إذا كانت الحالة "low"، اذكر المدة المتبقية من المخزون وأوصِ بشراء الكمية المطلوبة بالضبط.
- إذا كانت الحالة "overstocked"، اذكر عدد أشهر المخزون وأوصِ بتخفيض المخزون (تخفيضات، نقل).
- إذا كانت الحالة "normal"، اذكر أن المخزون كافٍ ولا حاجة لشراء.
- اكتب جملة التوصية فقط، لا شيء آخر.
"""
