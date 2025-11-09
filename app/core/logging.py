# core/logging.py
import logging
import threading
import uuid
import time
import json
from datetime import datetime
from contextvars import ContextVar
from typing import Dict, Any, Optional
import inspect
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# 全局TraceID上下文变量
trace_id_var: ContextVar[str] = ContextVar('trace_id', default='')


class StructuredLogger:
    """结构化日志记录器"""

    def __init__(self, name: str):
        self.logger = logging.getLogger(name)

    def _build_log_record(
            self,
            level: str,
            message: str,
            trace_id: str = "",
            extra: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """构建结构化日志记录"""
        frame = inspect.currentframe().f_back.f_back  # 获取调用者的帧信息

        record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": level,
            "logger": self.logger.name,
            "message": message,
            "traceId": trace_id or trace_id_var.get() or self._generate_trace_id(),
            "module": inspect.getmodule(frame).__name__ if inspect.getmodule(frame) else "",
            "function": frame.f_code.co_name,
            "line": frame.f_lineno,
            "thread": threading.current_thread().name,
        }

        if extra:
            record.update(extra)

        return record

    def _generate_trace_id(self) -> str:
        """生成TraceID"""
        return f"trace_{uuid.uuid4().hex[:16]}"

    def _log(self, level: str, message: str, **kwargs):
        """统一日志记录方法"""
        record = self._build_log_record(level, message, **kwargs)

        # 根据级别记录日志
        if level == "DEBUG":
            self.logger.debug(json.dumps(record, ensure_ascii=False))
        elif level == "INFO":
            self.logger.info(json.dumps(record, ensure_ascii=False))
        elif level == "WARNING":
            self.logger.warning(json.dumps(record, ensure_ascii=False))
        elif level == "ERROR":
            self.logger.error(json.dumps(record, ensure_ascii=False))
        elif level == "CRITICAL":
            self.logger.critical(json.dumps(record, ensure_ascii=False))

    def debug(self, message: str, **kwargs):
        self._log("DEBUG", message, **kwargs)

    def info(self, message: str, **kwargs):
        self._log("INFO", message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log("WARNING", message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log("ERROR", message, **kwargs)

    def critical(self, message: str, **kwargs):
        self._log("CRITICAL", message, **kwargs)


# 全局日志记录器实例
logger = StructuredLogger("fastapi.app")