import pytest
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

@pytest.fixture(autouse=True)
def setup_test_env():
    os.environ['DEBUG'] = 'true'
    os.environ['LOG_LEVEL'] = 'error'
    yield
