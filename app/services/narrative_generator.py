"""
AI Narrative Generator.
Takes structured data + prompt template → calls AI provider → returns narrative text.
"""
import logging
from typing import Optional
from app.services.ai_provider import get_ai_provider

logger = logging.getLogger(__name__)

def generate_narrative(
    prompt_template: str,
    context: dict,
    lang: str = 'en',
    max_tokens: int = 500,
    temperature: float = 0.7,
) -> str:
    """
    Generate AI-powered narrative text from structured data.

    Args:
        prompt_template: Template string with {placeholders} for context values
        context: Dict of values to fill template placeholders
        lang: Language for the narrative ('en' or 'ar')
        max_tokens: Max tokens for AI response
        temperature: AI creativity (0.0-1.0)

    Returns:
        Narrative text string, or empty string if AI unavailable
    """
    try:
        # Build the prompt from template + context
        prompt = prompt_template.format(**context)
    except KeyError as e:
        logger.warning(f"Missing prompt context key: {e}")
        prompt = prompt_template

    try:
        provider = get_ai_provider()
        result = provider.generate(prompt, max_tokens=max_tokens, temperature=temperature)
        if result and not result.startswith('[AI Fallback]'):
            return result.strip()
        logger.info("AI provider returned fallback response — skipping narrative")
        return ""
    except Exception as e:
        logger.error(f"Narrative generation failed: {e}")
        return ""


def format_kpis_for_prompt(kpis: list) -> str:
    """Format KPI list for inclusion in a prompt."""
    if not kpis:
        return "No KPI data available."
    lines = []
    for k in kpis:
        name = k.get('name', 'unknown')
        value = k.get('value', 'N/A')
        trend = k.get('trend', '')
        expl = k.get('explanation', '')
        lines.append(f"- {name}: {value} ({trend}) — {expl}")
    return "\n".join(lines)


def format_alerts_for_prompt(alerts: list) -> str:
    """Format alert list for inclusion in a prompt."""
    if not alerts:
        return "No active alerts."
    lines = []
    for a in alerts:
        sev = a.get('severity', 'info')
        msg = a.get('message', '')
        action = a.get('recommended_action', '')
        lines.append(f"[{sev.upper()}] {msg} | Action: {action}")
    return "\n".join(lines)


def format_insights_for_prompt(insights: list) -> str:
    """Format insight list for inclusion in a prompt."""
    if not insights:
        return "No insights generated."
    lines = []
    for ins in insights:
        title = ins.get('title', '')
        desc = ins.get('description', '')
        conf = ins.get('confidence', 0)
        action = ins.get('recommended_action', '')
        lines.append(f"- {title}: {desc} (confidence: {conf:.0%}) | Action: {action}")
    return "\n".join(lines)
