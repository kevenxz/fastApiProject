# ai_integration/services/kimi.py
import aiohttp
from typing import Dict, Any, List, Optional
from .ai_service import AIService

class GuijiService(AIService):
    """硅基流动服务实现 - 支持多平台"""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.moonshot.cn",
        model: str = "moonshot-v1-8k"
    ):
        super().__init__(api_key, base_url)
        self.model = model
        self.platform_info = self._detect_platform(base_url)

    def _detect_platform(self, base_url: str) -> Dict[str, str]:
        """检测平台信息"""
        if "siliconflow" in base_url:
            return {"name": "siliconflow", "display": "硅基流动"}
        elif "moonshot" in base_url:
            return {"name": "moonshot", "display": "月之暗面"}
        else:
            return {"name": "unknown", "display": "未知平台"}

    @property
    def service_name(self) -> str:
        return f"kimi-{self.platform_info['name']}"

    async def chat_completion(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": kwargs.get("model", self.model),
            "messages": messages,
            "temperature": kwargs.get("temperature", 0.3),
            "max_tokens": kwargs.get("max_tokens", 2048),
            "stream": kwargs.get("stream", False)
        }

        # 移除None值
        payload = {k: v for k, v in payload.items() if v is not None}

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result
                    else:
                        error_text = await response.text()
                        raise Exception(f"Kimi API Error: {response.status} - {error_text}")
            except aiohttp.ClientError as e:
                raise Exception(f"Network error: {str(e)}")

    async def embedding(self, text: str, **kwargs) -> List[float]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": kwargs.get("model", "moonshot-ai/embedding-v1"),
            "input": text
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{self.base_url}/v1/embeddings",
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result["data"][0]["embedding"]
                    else:
                        error_text = await response.text()
                        raise Exception(f"Kimi Embedding API Error: {response.status} - {error_text}")
            except aiohttp.ClientError as e:
                raise Exception(f"Network error: {str(e)}")
import requests

url = "https://api.siliconflow.cn/v1/chat/completions"

payload = {
    "model": "deepseek-ai/DeepSeek-V3.2-Exp",
    "messages": [
        {
            "role": "user",
            "content": "What opportunities and challenges will the Chinese large model industry face in 2025?"
        }
    ],
    "stream": False,
    "max_tokens": 100,
    "enable_thinking": True,
    "thinking_budget": 4096,
    "min_p": 0.05,
    "stop": None,
    "temperature": 0.7,
    "top_p": 0.7,
    "top_k": 50,
    "frequency_penalty": 0.5,
    "n": 1,
    "response_format": { "type": "text" },
    "tools": [
        {
            "type": "function",
            "function": {
                "description": "<string>",
                "name": "<string>",
                "parameters": {},
                "strict": False
            }
        }
    ]
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())