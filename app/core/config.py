# core/config.py
import logging
import sys
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
import json
import os

def setup_logging():
    """设置结构化日志配置"""

    # 创建JSON格式化器
    class JSONFormatter(logging.Formatter):

        # 定义日志目录和文件路径
        log_dir = "logs"  # 相对于项目根目录
        log_file = os.path.join(log_dir, "app.log")

        # 确保日志目录存在
        os.makedirs(log_dir, exist_ok=True)

        # 创建文件处理器
        file_handler = TimedRotatingFileHandler(
            log_file,
            when="midnight",
            interval=1,
            backupCount=7,
            encoding="utf-8"
        )
        def format(self, record):
            """将日志记录格式化为JSON字符串"""
            try:
                # 解析日志消息（如果是JSON字符串）
                log_data = json.loads(record.getMessage())
            except (json.JSONDecodeError, TypeError):
                # 如果不是JSON，创建基础结构
                log_data = {
                    "message": record.getMessage(),
                    "timestamp": self.formatTime(record),
                    "level": record.levelname,
                    "logger": record.name
                }

            # 添加异常信息
            if record.exc_info:
                log_data["exception"] = self.formatException(record.exc_info)

            return json.dumps(log_data, ensure_ascii=False)

    # 创建控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(JSONFormatter())

    # 创建文件处理器（按时间轮转）
    file_handler = TimedRotatingFileHandler(
        filename='logs/app.log',
        when='midnight',
        interval=1,
        backupCount=30,
        encoding='utf-8'
    )
    file_handler.setFormatter(JSONFormatter())

    # 创建错误日志处理器
    error_handler = TimedRotatingFileHandler(
        filename='logs/error.log',
        when='midnight',
        interval=1,
        backupCount=30,
        encoding='utf-8'
    )
    error_handler.setFormatter(JSONFormatter())
    error_handler.setLevel(logging.ERROR)

    # 配置根日志记录器
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # 移除默认处理器，添加自定义处理器
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_handler)

    # 设置特定库的日志级别
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)