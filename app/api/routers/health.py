# app/api/routers/health.py
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import psutil
import time

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """健康检查接口"""
    try:
        # 获取系统信息
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()

        return {
            "status": "healthy",
            "timestamp": time.time(),
            "system_info": {
                "cpu_usage": f"{cpu_percent}%",
                "memory_usage": f"{memory.percent}%",
                "memory_available": f"{memory.available / (1024**3):.2f} GB"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ready")
async def readiness_check():
    """就绪检查接口"""
    return {"status": "ready"}
