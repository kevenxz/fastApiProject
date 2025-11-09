# core/dependencies.py
from fastapi import Depends, Request
from typing import Optional

from .logging import trace_id_var, logger


def get_trace_id(request: Request) -> str:
    """获取当前请求的TraceID"""
    return trace_id_var.get()


def get_logger():
    """获取日志记录器依赖"""
    return logger


async def log_service_call(service_name: str, operation: str, parameters: dict = None, trace_id: str = None):
    """记录服务调用日志"""
    logger.info(
        f"服务调用: {service_name}.{operation}",
        trace_id=trace_id or trace_id_var.get(),
        extra={
            "serviceCall": {
                "service": service_name,
                "operation": operation,
                "parameters": parameters or {}
            }
        }
    )


async def log_database_query(query: str, parameters: dict = None, execution_time: float = None, trace_id: str = None):
    """记录数据库查询日志"""
    extra_data = {
        "databaseQuery": {
            "query": query,
            "parameters": parameters or {},
        }
    }

    if execution_time is not None:
        extra_data["databaseQuery"]["executionTime"] = execution_time

    logger.debug(
        "数据库查询执行",
        trace_id=trace_id or trace_id_var.get(),
        extra=extra_data
    )