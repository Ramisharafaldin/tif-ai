"""
Logging configuration for structured JSON logging.
"""
import logging
import json
import sys
from typing import Any, Dict

class JSONFormatter(logging.Formatter):
    """Custom formatter to output logs as JSON strings."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        # Include exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        # Include extra fields
        if hasattr(record, "extra"):
            log_entry.update(record.extra)
        return json.dumps(log_entry)

def setup_logging(level: str = "INFO") -> None:
    """
    Configure root logger with JSON formatter.
    Args:
        level: Logging level (e.g., "INFO", "DEBUG")
    """
    log_level = getattr(logging, level.upper(), logging.INFO)
    
    # Get root logger
    logger = logging.getLogger()
    logger.setLevel(log_level)
    
    # Remove any existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    formatter = JSONFormatter()
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    # Prevent propagation to root logger if we are configuring a named logger
    # But we are configuring the root, so it's fine.
