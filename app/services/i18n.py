from typing import Optional

_AR = {
    # KPI names
    'total_sales_qty': 'إجمالي كمية المبيعات',
    'total_inventory_value': 'إجمالي قيمة المخزون',
    'inventory_turns': 'معدل دوران المخزون',
    # KPI explanations
    'Total quantity sold across all branches.': 'إجمالي الكمية المباعة عبر جميع الفروع.',
    'Total inventory value at cost.': 'إجمالي قيمة المخزون بسعر التكلفة.',
    'Ratio of cost of goods sold to average inventory value.': 'نسبة تكلفة البضائع المباعة إلى متوسط قيمة المخزون.',
    # Trends
    'stable': 'مستقر',
    'up': 'مرتفع',
    'down': 'منخفض',
    # Insight titles
    'Low Inventory Turnover': 'دوران مخزون منخفض',
    'Healthy Inventory Turnover': 'دوران مخزون صحي',
    # Insight descriptions
    'Inventory turnover is below 2, indicating possible overstock.': 'معدل دوران المخزون أقل من 2، مما يشير إلى وجود فائض محتمل.',
    'Inventory turnover is within a healthy range.': 'معدل دوران المخزون ضمن النطاق الصحي.',
    # Recommended actions
    'Review slow-moving items and consider discount promotions.': 'مراجعة الأصناف بطيئة الحركة والنظر في عروض الخصم.',
    'Continue to monitor inventory levels.': 'استمر في مراقبة مستويات المخزون.',
    'Check for possible promotions or data errors.': 'تحقق من وجود عروض ترويجية أو أخطاء في البيانات.',
    'Consider discount promotions or transfer to other branches.': 'فكر في عروض الخصم أو النقل إلى الفروع الأخرى.',
    'Place purchase orders to replenish stock.': 'تقديم أوامر شراء لتعويض المخزون.',
    'Urgent replenishment required.': 'تعويض عاجل مطلوب.',
    'No transfers required at this time.': 'لا توجد تحويلات مطلوبة في الوقت الحالي.',
    # Alert messages
    'Stock levels are balanced across all branches.': 'مستويات المخزون متوازنة عبر جميع الفروع.',
    # Executive summary
    'Key metrics show {0} indicators.': '{0} مؤشر رئيسي.',
    '{0} alerts require attention.': '{0} تنبيه تحتاج إلى متابعة.',
    '{0} insights identified.': '{0} رؤية تم تحديدها.',
    'No significant data available.': 'لا توجد بيانات مهمة متاحة.',
    # Anomaly alert message template
    'Unusual sales volume on {0}: {1} units (Z-Score {2})': 'حجم مبيعات غير عادي في {0}: {1} وحدة (درجة Z {2})',
    # Overstock alert
    '{0} product(s) are overstocked (>6 months supply).': '{0} منتج/منتجات بها فائض مخزون (>6 أشهر توريد).',
    # Low stock alert
    '{0} product(s) have low stock levels (<1 month supply).': '{0} منتج/منتجات بمستوى مخزون منخفض (<شهر توريد).',
    # Out of stock alert
    '{0} product(s) are out of stock.': '{0} منتج/منتجات نفدت من المخزون.',
    # Alert types
    'anomaly': 'شذوذ',
    'overstock': 'فائض مخزون',
    'low_stock': 'مخزون منخفض',
    'out_of_stock': 'نفد من المخزون',
    'no_transfers_needed': 'لا حاجة للتحويل',
    # Status
    'normal': 'طبيعي',
    'low': 'منخفض',
    'overstocked': 'فائض',
    'out_of_stock': 'نافد',
    # Severity
    'high': 'عالية',
    'medium': 'متوسطة',
    'low': 'منخفضة',
    # Transfer reason
    'Branch {0} has {1} months of stock; Branch {2} has only {3} months.': 'الفرع {0} لديه مخزون {1} شهر؛ الفرع {2} لديه فقط {3} شهر.',
    # Data messages
    'Data reloaded successfully': 'تم إعادة تحميل البيانات بنجاح',
    'Product code already exists': 'رمز المنتج موجود بالفعل',
    'Product not found': 'المنتج غير موجود',
    'Product deleted': 'تم حذف المنتج',
    # Priority
    'high': 'عالية',
    'medium': 'متوسطة',
}

def t(key: str, lang: Optional[str] = None, **fmt) -> str:
    if lang != 'ar':
        if fmt:
            return key.format(**fmt) if fmt else key
        return key
    translated = _AR.get(key, key)
    if fmt:
        try:
            return translated.format(**fmt)
        except KeyError:
            return translated
    return translated
