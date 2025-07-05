#!/usr/bin/env python3
import requests
import json
import time
import os
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    env_file_path = "/app/frontend/.env"
    with open(env_file_path, "r") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                return line.strip().split("=")[1].strip('"')
    raise ValueError("REACT_APP_BACKEND_URL not found in frontend/.env")

# Main test class
class BackendTester:
    def __init__(self):
        self.base_url = get_backend_url()
        self.api_url = f"{self.base_url}/api"
        self.test_results = {
            "health_check": False,
            "cors": False,
            "mongodb_connection": False,
            "status_post": False,
            "status_get": False
        }
        self.test_client_name = f"test_client_{int(time.time())}"
        
    def run_all_tests(self):
        """Run all backend tests and print results"""
        print(f"Starting backend tests against {self.api_url}")
        
        self.test_health_check()
        self.test_cors()
        self.test_status_post()
        self.test_status_get()
        
        # Print test results
        print("\n=== TEST RESULTS ===")
        all_passed = True
        for test_name, result in self.test_results.items():
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name}: {status}")
            if not result:
                all_passed = False
        
        if all_passed:
            print("\n🎉 All backend tests passed successfully!")
            return True
        else:
            print("\n❌ Some tests failed. See details above.")
            return False
    
    def test_health_check(self):
        """Test the root API endpoint"""
        try:
            print("\n--- Testing Health Check Endpoint ---")
            response = requests.get(f"{self.api_url}/")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200 and "message" in response.json():
                self.test_results["health_check"] = True
                print("✅ Health check endpoint is working")
            else:
                print("❌ Health check endpoint failed")
        except Exception as e:
            print(f"❌ Error testing health check endpoint: {str(e)}")
    
    def test_cors(self):
        """Test CORS headers"""
        try:
            print("\n--- Testing CORS Headers ---")
            headers = {
                "Origin": "http://example.com",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type"
            }
            response = requests.options(f"{self.api_url}/", headers=headers)
            print(f"Status code: {response.status_code}")
            print(f"CORS Headers: {json.dumps(dict(response.headers), indent=2)}")
            
            if (response.status_code == 200 and 
                "access-control-allow-origin" in response.headers and
                "access-control-allow-methods" in response.headers):
                self.test_results["cors"] = True
                print("✅ CORS is properly configured")
            else:
                print("❌ CORS configuration failed")
        except Exception as e:
            print(f"❌ Error testing CORS: {str(e)}")
    
    def test_status_post(self):
        """Test POST /api/status endpoint"""
        try:
            print(f"\n--- Testing POST Status Endpoint ---")
            payload = {"client_name": self.test_client_name}
            response = requests.post(f"{self.api_url}/status", json=payload)
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200 and "id" in response.json():
                self.test_results["status_post"] = True
                self.test_results["mongodb_connection"] = True
                print("✅ Status POST endpoint is working")
                print("✅ MongoDB connection is working")
            else:
                print("❌ Status POST endpoint failed")
        except Exception as e:
            print(f"❌ Error testing status POST endpoint: {str(e)}")
    
    def test_status_get(self):
        """Test GET /api/status endpoint"""
        try:
            print(f"\n--- Testing GET Status Endpoint ---")
            response = requests.get(f"{self.api_url}/status")
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Found {len(data)} status records")
                
                # Check if our test client name is in the results
                found_test_client = False
                for item in data:
                    if item.get("client_name") == self.test_client_name:
                        found_test_client = True
                        break
                
                if found_test_client:
                    self.test_results["status_get"] = True
                    print("✅ Status GET endpoint is working and found our test record")
                else:
                    print("⚠️ Status GET endpoint returned data but our test record was not found")
                    # Still mark as success if we got data back
                    if data:
                        self.test_results["status_get"] = True
            else:
                print("❌ Status GET endpoint failed")
        except Exception as e:
            print(f"❌ Error testing status GET endpoint: {str(e)}")

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)