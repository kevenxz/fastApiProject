# tests/test_ai_integration/test_endpoints.py
from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

def test_root_endpoint():
    """测试根路径接口"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

def test_ai_service_list():
    """测试AI服务列表接口"""
    response = client.get("/api/ai/services")
    assert response.status_code == 200

def test_ai_config_endpoint():
    """测试AI配置接口"""
    response = client.get("/api/ai/config")
    assert response.status_code == 200

def test_health_check():
    """测试健康检查接口"""
    response = client.get("/health/")
    assert response.status_code == 200

def test_readiness_check():
    """测试就绪检查接口"""
    response = client.get("/health/ready")
    assert response.status_code == 200
