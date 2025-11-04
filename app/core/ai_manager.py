# app/core/ai_manager.py
import sys
import os

# 将ai_integration添加到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from ai_integration.manager import AIManager

# 创建全局AI管理器实例
ai_manager = AIManager("ai_config.yaml")
