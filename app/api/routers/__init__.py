# app/api/routers/__init__.py
"""API路由模块"""
from . import ai_router as ai_router_module
from . import health as health_module

# 保持原来的导入方式
from .ai_router import router as ai_router
from .health import router as health

__all__ = ["ai_router", "health"]
