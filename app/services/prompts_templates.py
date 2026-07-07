"""
Prompt template registry. Maps agent names and languages to their prompt templates.
"""
from app.services.prompts.dashboard import DASHBOARD_EN, DASHBOARD_AR
from app.services.prompts.inventory import INVENTORY_EN, INVENTORY_AR
from app.services.prompts.inventory_item import INVENTORY_ITEM_EN, INVENTORY_ITEM_AR
from app.services.prompts.forecasting import FORECAST_EN, FORECAST_AR
from app.services.prompts.chat import CHAT_EN, CHAT_AR

TEMPLATES = {
    'dashboard': {'en': DASHBOARD_EN, 'ar': DASHBOARD_AR},
    'inventory': {'en': INVENTORY_EN, 'ar': INVENTORY_AR},
    'inventory_item': {'en': INVENTORY_ITEM_EN, 'ar': INVENTORY_ITEM_AR},
    'forecasting': {'en': FORECAST_EN, 'ar': FORECAST_AR},
    'chat': {'en': CHAT_EN, 'ar': CHAT_AR},
}

def get_template(name: str, lang: str = 'en') -> str:
    """Get the prompt template for a given agent name and language."""
    agent_templates = TEMPLATES.get(name, {})
    return agent_templates.get(lang, agent_templates.get('en', ''))
