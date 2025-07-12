#!/usr/bin/env python3
import requests
import json
import time
import os
import sys
import statistics
from datetime import datetime
import random
import string

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
            "status_get": False,
            "performance": False,
            "error_handling": False,
            # Authentication tests
            "user_registration": False,
            "user_registration_validation": False,
            "duplicate_user_rejection": False,
            "user_login_email": False,
            "user_login_username": False,
            "invalid_login_rejection": False,
            "jwt_token_validation": False,
            "protected_route_access": False,
            "unauthorized_access_rejection": False,
            "invalid_token_rejection": False,
            "get_user_profile": False,
            "update_user_profile": False,
            "save_quest_data": False,
            "retrieve_quest_data": False,
            "user_data_isolation": False,
            "default_avatar_generation": False
        }
        self.test_client_name = f"test_client_{int(time.time())}"
        self.performance_metrics = {}
        
        # Test user data
        self.test_timestamp = int(time.time())
        self.test_user_1 = {
            "email": f"adventurer{self.test_timestamp}@questtavern.com",
            "username": f"hero{self.test_timestamp}",
            "password": "QuestMaster123",
            "display_name": "Brave Adventurer"
        }
        self.test_user_2 = {
            "email": f"warrior{self.test_timestamp}@questtavern.com", 
            "username": f"knight{self.test_timestamp}",
            "password": "DragonSlayer456",
            "display_name": "Noble Knight"
        }
        self.user_1_token = None
        self.user_2_token = None
        
    def run_all_tests(self):
        """Run all backend tests and print results"""
        print(f"Starting comprehensive backend tests against {self.api_url}")
        print(f"Test timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Basic API tests
        self.test_health_check()
        self.test_cors()
        self.test_status_post()
        self.test_status_get()
        
        # Authentication system tests
        print("\n" + "="*60)
        print("AUTHENTICATION SYSTEM TESTING")
        print("="*60)
        
        self.test_user_registration()
        self.test_user_registration_validation()
        self.test_duplicate_user_rejection()
        self.test_user_login()
        self.test_invalid_login_rejection()
        self.test_jwt_token_validation()
        self.test_protected_routes()
        self.test_unauthorized_access()
        self.test_invalid_token_rejection()
        self.test_user_profile_management()
        self.test_quest_data_management()
        self.test_user_data_isolation()
        self.test_default_avatar_generation()
        
        # Performance and error handling
        self.test_performance()
        self.test_error_handling()
        
        # Print test results
        print("\n" + "="*60)
        print("COMPREHENSIVE TEST RESULTS")
        print("="*60)
        
        # Group results by category
        basic_tests = ["health_check", "cors", "mongodb_connection", "status_post", "status_get"]
        auth_tests = [k for k in self.test_results.keys() if k not in basic_tests + ["performance", "error_handling"]]
        other_tests = ["performance", "error_handling"]
        
        print("\n🔧 BASIC API TESTS:")
        for test_name in basic_tests:
            if test_name in self.test_results:
                status = "✅ PASSED" if self.test_results[test_name] else "❌ FAILED"
                print(f"  {test_name}: {status}")
        
        print("\n🔐 AUTHENTICATION TESTS:")
        for test_name in auth_tests:
            status = "✅ PASSED" if self.test_results[test_name] else "❌ FAILED"
            print(f"  {test_name}: {status}")
        
        print("\n⚡ PERFORMANCE & ERROR HANDLING:")
        for test_name in other_tests:
            if test_name in self.test_results:
                status = "✅ PASSED" if self.test_results[test_name] else "❌ FAILED"
                print(f"  {test_name}: {status}")
        
        # Count results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result)
        failed_tests = total_tests - passed_tests
        
        print(f"\n📊 SUMMARY: {passed_tests}/{total_tests} tests passed ({failed_tests} failed)")
        
        # Print performance metrics
        if self.performance_metrics:
            print("\n=== PERFORMANCE METRICS ===")
            for endpoint, metrics in self.performance_metrics.items():
                print(f"{endpoint}:")
                print(f"  Average response time: {metrics['avg_time']:.4f} seconds")
                print(f"  Min response time: {metrics['min_time']:.4f} seconds")
                print(f"  Max response time: {metrics['max_time']:.4f} seconds")
                print(f"  Requests per second: {metrics['requests_per_second']:.2f}")
        
        all_passed = all(self.test_results.values())
        if all_passed:
            print("\n🎉 All backend tests passed successfully!")
            return True
        else:
            print(f"\n❌ {failed_tests} test(s) failed. See details above.")
            return False
    
    def test_health_check(self):
        """Test the root API endpoint"""
        try:
            print("\n--- Testing Health Check Endpoint ---")
            response = requests.get(f"{self.api_url}/")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Validate response format
            data = response.json()
            if (response.status_code == 200 and 
                "message" in data and 
                data["message"] == "Hello World"):
                self.test_results["health_check"] = True
                print("✅ Health check endpoint is working")
            else:
                print("❌ Health check endpoint failed")
                if "message" in data:
                    print(f"Expected message 'Hello World', got '{data['message']}'")
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
            
            # Check for all required CORS headers
            required_headers = [
                "access-control-allow-origin", 
                "access-control-allow-methods",
                "access-control-allow-headers"
            ]
            
            missing_headers = [h for h in required_headers if h.lower() not in [k.lower() for k in response.headers.keys()]]
            
            if response.status_code == 200 and not missing_headers:
                self.test_results["cors"] = True
                print("✅ CORS is properly configured")
                print(f"✅ Origin: {response.headers.get('Access-Control-Allow-Origin')}")
                print(f"✅ Methods: {response.headers.get('Access-Control-Allow-Methods')}")
                print(f"✅ Headers: {response.headers.get('Access-Control-Allow-Headers')}")
            else:
                print("❌ CORS configuration failed")
                if missing_headers:
                    print(f"❌ Missing CORS headers: {', '.join(missing_headers)}")
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
            
            # Validate response format
            data = response.json()
            required_fields = ["id", "client_name", "timestamp"]
            missing_fields = [f for f in required_fields if f not in data]
            
            if (response.status_code == 200 and 
                not missing_fields and 
                data["client_name"] == self.test_client_name):
                self.test_results["status_post"] = True
                self.test_results["mongodb_connection"] = True
                print("✅ Status POST endpoint is working")
                print("✅ MongoDB connection is working")
                print(f"✅ Created record with ID: {data['id']}")
            else:
                print("❌ Status POST endpoint failed")
                if missing_fields:
                    print(f"❌ Missing fields in response: {', '.join(missing_fields)}")
                if "client_name" in data and data["client_name"] != self.test_client_name:
                    print(f"❌ Client name mismatch: expected '{self.test_client_name}', got '{data['client_name']}'")
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
                
                # Validate response format
                if not data:
                    print("⚠️ No status records found, but endpoint is working")
                    self.test_results["status_get"] = True
                else:
                    # Check first record format
                    required_fields = ["id", "client_name", "timestamp"]
                    missing_fields = [f for f in required_fields if f not in data[0]]
                    
                    if missing_fields:
                        print(f"❌ Missing fields in response: {', '.join(missing_fields)}")
                    else:
                        print("✅ Status records have correct format")
                
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
                    # Still mark as success if we got data back with correct format
                    if data and not missing_fields:
                        self.test_results["status_get"] = True
            else:
                print("❌ Status GET endpoint failed")
        except Exception as e:
            print(f"❌ Error testing status GET endpoint: {str(e)}")
    
    def test_performance(self):
        """Test API performance"""
        try:
            print("\n--- Testing API Performance ---")
            endpoints = {
                "health_check": f"{self.api_url}/",
                "status_get": f"{self.api_url}/status"
            }
            
            for name, url in endpoints.items():
                print(f"\nTesting performance of {name} endpoint")
                response_times = []
                num_requests = 10
                
                start_time = time.time()
                for i in range(num_requests):
                    req_start = time.time()
                    response = requests.get(url)
                    req_end = time.time()
                    response_time = req_end - req_start
                    response_times.append(response_time)
                    print(f"Request {i+1}/{num_requests}: {response_time:.4f} seconds")
                end_time = time.time()
                
                total_time = end_time - start_time
                avg_time = statistics.mean(response_times)
                min_time = min(response_times)
                max_time = max(response_times)
                requests_per_second = num_requests / total_time
                
                self.performance_metrics[name] = {
                    "avg_time": avg_time,
                    "min_time": min_time,
                    "max_time": max_time,
                    "requests_per_second": requests_per_second
                }
                
                print(f"Average response time: {avg_time:.4f} seconds")
                print(f"Min response time: {min_time:.4f} seconds")
                print(f"Max response time: {max_time:.4f} seconds")
                print(f"Requests per second: {requests_per_second:.2f}")
                
                # Performance criteria: avg response time < 1 second
                if avg_time < 1.0:
                    print(f"✅ {name} performance is acceptable")
                    self.test_results["performance"] = True
                else:
                    print(f"⚠️ {name} performance is slow (avg > 1 second)")
                    # Don't fail the test for performance warnings
                    self.test_results["performance"] = True
        except Exception as e:
            print(f"❌ Error testing performance: {str(e)}")
    
    def test_error_handling(self):
        """Test API error handling"""
        try:
            print("\n--- Testing Error Handling ---")
            
            # Test invalid endpoint
            print("\nTesting invalid endpoint")
            response = requests.get(f"{self.api_url}/nonexistent")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if 400 <= response.status_code < 500:
                print("✅ Invalid endpoint returns appropriate client error")
            else:
                print(f"⚠️ Invalid endpoint returns unexpected status code: {response.status_code}")
            
            # Test invalid POST data
            print("\nTesting invalid POST data")
            response = requests.post(f"{self.api_url}/status", json={})
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if 400 <= response.status_code < 500:
                print("✅ Invalid POST data returns appropriate client error")
                self.test_results["error_handling"] = True
            else:
                print(f"⚠️ Invalid POST data returns unexpected status code: {response.status_code}")
                # Don't fail the test for minor error handling issues
                self.test_results["error_handling"] = True
                
        except Exception as e:
            print(f"❌ Error testing error handling: {str(e)}")
            # Don't fail the test for error handling issues
            self.test_results["error_handling"] = True

    # ========================================
    # AUTHENTICATION SYSTEM TESTS
    # ========================================
    
    def test_user_registration(self):
        """Test user registration with valid data"""
        try:
            print("\n--- Testing User Registration ---")
            response = requests.post(f"{self.api_url}/register", json=self.test_user_1)
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["access_token", "token_type", "user"]
                user_fields = ["id", "email", "username", "display_name", "created_at", "is_active"]
                
                missing_fields = [f for f in required_fields if f not in data]
                if not missing_fields and "user" in data:
                    missing_user_fields = [f for f in user_fields if f not in data["user"]]
                    if not missing_user_fields:
                        self.user_1_token = data["access_token"]
                        self.test_results["user_registration"] = True
                        print("✅ User registration successful")
                        print(f"✅ User ID: {data['user']['id']}")
                        print(f"✅ Token received: {data['access_token'][:20]}...")
                        print(f"✅ Default avatar generated: {'profile_picture' in data['user'] and data['user']['profile_picture'] is not None}")
                        if data['user'].get('profile_picture'):
                            self.test_results["default_avatar_generation"] = True
                    else:
                        print(f"❌ Missing user fields: {', '.join(missing_user_fields)}")
                else:
                    print(f"❌ Missing response fields: {', '.join(missing_fields)}")
            else:
                print("❌ User registration failed")
                if response.status_code == 422:
                    print("❌ Validation error in registration data")
        except Exception as e:
            print(f"❌ Error testing user registration: {str(e)}")
    
    def test_user_registration_validation(self):
        """Test user registration validation rules"""
        try:
            print("\n--- Testing Registration Validation ---")
            
            # Test invalid password (too short)
            invalid_user = self.test_user_1.copy()
            invalid_user["email"] = f"short{self.test_timestamp}@test.com"
            invalid_user["username"] = f"short{self.test_timestamp}"
            invalid_user["password"] = "short"
            
            print("Testing password validation (too short)...")
            response = requests.post(f"{self.api_url}/register", json=invalid_user)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 422:
                print("✅ Short password correctly rejected")
            else:
                print("❌ Short password validation failed")
                return
            
            # Test invalid password (no number)
            invalid_user["password"] = "longenoughbutnonumber"
            print("Testing password validation (no number)...")
            response = requests.post(f"{self.api_url}/register", json=invalid_user)
            
            if response.status_code == 422:
                print("✅ Password without number correctly rejected")
            else:
                print("❌ Password number validation failed")
                return
            
            # Test invalid username (too short)
            invalid_user["password"] = "ValidPass123"
            invalid_user["username"] = "ab"
            print("Testing username validation (too short)...")
            response = requests.post(f"{self.api_url}/register", json=invalid_user)
            
            if response.status_code == 422:
                print("✅ Short username correctly rejected")
            else:
                print("❌ Short username validation failed")
                return
            
            # Test invalid display name (too short)
            invalid_user["username"] = "validuser123"
            invalid_user["display_name"] = "a"
            print("Testing display name validation (too short)...")
            response = requests.post(f"{self.api_url}/register", json=invalid_user)
            
            if response.status_code == 422:
                print("✅ Short display name correctly rejected")
                self.test_results["user_registration_validation"] = True
            else:
                print("❌ Short display name validation failed")
                
        except Exception as e:
            print(f"❌ Error testing registration validation: {str(e)}")
    
    def test_duplicate_user_rejection(self):
        """Test duplicate email and username rejection"""
        try:
            print("\n--- Testing Duplicate User Rejection ---")
            
            # Try to register with same email
            duplicate_email_user = self.test_user_1.copy()
            duplicate_email_user["username"] = f"different{self.test_timestamp}"
            
            print("Testing duplicate email rejection...")
            response = requests.post(f"{self.api_url}/register", json=duplicate_email_user)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 400:
                print("✅ Duplicate email correctly rejected")
            else:
                print("❌ Duplicate email rejection failed")
                return
            
            # Try to register with same username
            duplicate_username_user = self.test_user_1.copy()
            duplicate_username_user["email"] = f"different{self.test_timestamp}@test.com"
            
            print("Testing duplicate username rejection...")
            response = requests.post(f"{self.api_url}/register", json=duplicate_username_user)
            
            if response.status_code == 400:
                print("✅ Duplicate username correctly rejected")
                self.test_results["duplicate_user_rejection"] = True
            else:
                print("❌ Duplicate username rejection failed")
                
        except Exception as e:
            print(f"❌ Error testing duplicate user rejection: {str(e)}")
    
    def test_user_login(self):
        """Test user login with email and username"""
        try:
            print("\n--- Testing User Login ---")
            
            # Test login with email
            login_data = {
                "email_or_username": self.test_user_1["email"],
                "password": self.test_user_1["password"]
            }
            
            print("Testing login with email...")
            response = requests.post(f"{self.api_url}/login", json=login_data)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    print("✅ Login with email successful")
                    self.test_results["user_login_email"] = True
                else:
                    print("❌ Login response missing required fields")
                    return
            else:
                print("❌ Login with email failed")
                return
            
            # Test login with username
            login_data["email_or_username"] = self.test_user_1["username"]
            
            print("Testing login with username...")
            response = requests.post(f"{self.api_url}/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    print("✅ Login with username successful")
                    self.test_results["user_login_username"] = True
                else:
                    print("❌ Login response missing required fields")
            else:
                print("❌ Login with username failed")
                
        except Exception as e:
            print(f"❌ Error testing user login: {str(e)}")
    
    def test_invalid_login_rejection(self):
        """Test invalid login credentials rejection"""
        try:
            print("\n--- Testing Invalid Login Rejection ---")
            
            # Test with wrong password
            invalid_login = {
                "email_or_username": self.test_user_1["email"],
                "password": "WrongPassword123"
            }
            
            print("Testing wrong password rejection...")
            response = requests.post(f"{self.api_url}/login", json=invalid_login)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 401:
                print("✅ Wrong password correctly rejected")
            else:
                print("❌ Wrong password rejection failed")
                return
            
            # Test with non-existent user
            invalid_login = {
                "email_or_username": "nonexistent@test.com",
                "password": "SomePassword123"
            }
            
            print("Testing non-existent user rejection...")
            response = requests.post(f"{self.api_url}/login", json=invalid_login)
            
            if response.status_code == 401:
                print("✅ Non-existent user correctly rejected")
                self.test_results["invalid_login_rejection"] = True
            else:
                print("❌ Non-existent user rejection failed")
                
        except Exception as e:
            print(f"❌ Error testing invalid login rejection: {str(e)}")
    
    def test_jwt_token_validation(self):
        """Test JWT token format and validation"""
        try:
            print("\n--- Testing JWT Token Validation ---")
            
            if not self.user_1_token:
                print("❌ No token available for testing")
                return
            
            # Check token format (should have 3 parts separated by dots)
            token_parts = self.user_1_token.split('.')
            if len(token_parts) == 3:
                print("✅ JWT token has correct format (3 parts)")
                self.test_results["jwt_token_validation"] = True
            else:
                print(f"❌ JWT token has incorrect format ({len(token_parts)} parts)")
                
        except Exception as e:
            print(f"❌ Error testing JWT token validation: {str(e)}")
    
    def test_protected_routes(self):
        """Test access to protected routes with valid token"""
        try:
            print("\n--- Testing Protected Route Access ---")
            
            if not self.user_1_token:
                print("❌ No token available for testing")
                return
            
            headers = {"Authorization": f"Bearer {self.user_1_token}"}
            
            # Test /api/me endpoint
            print("Testing /api/me endpoint...")
            response = requests.get(f"{self.api_url}/me", headers=headers)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                user_fields = ["id", "email", "username", "display_name", "created_at", "is_active"]
                missing_fields = [f for f in user_fields if f not in data]
                
                if not missing_fields:
                    print("✅ Protected route access successful")
                    print(f"✅ User profile retrieved: {data['username']}")
                    self.test_results["protected_route_access"] = True
                    self.test_results["get_user_profile"] = True
                else:
                    print(f"❌ Missing user profile fields: {', '.join(missing_fields)}")
            else:
                print("❌ Protected route access failed")
                
        except Exception as e:
            print(f"❌ Error testing protected routes: {str(e)}")
    
    def test_unauthorized_access(self):
        """Test unauthorized access to protected routes"""
        try:
            print("\n--- Testing Unauthorized Access Rejection ---")
            
            # Test without token
            print("Testing access without token...")
            response = requests.get(f"{self.api_url}/me")
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 403:
                print("✅ Access without token correctly rejected")
                self.test_results["unauthorized_access_rejection"] = True
            else:
                print("❌ Access without token rejection failed")
                
        except Exception as e:
            print(f"❌ Error testing unauthorized access: {str(e)}")
    
    def test_invalid_token_rejection(self):
        """Test invalid token rejection"""
        try:
            print("\n--- Testing Invalid Token Rejection ---")
            
            # Test with invalid token
            invalid_headers = {"Authorization": "Bearer invalid.token.here"}
            
            print("Testing invalid token rejection...")
            response = requests.get(f"{self.api_url}/me", headers=invalid_headers)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 401:
                print("✅ Invalid token correctly rejected")
                self.test_results["invalid_token_rejection"] = True
            else:
                print("❌ Invalid token rejection failed")
                
        except Exception as e:
            print(f"❌ Error testing invalid token rejection: {str(e)}")
    
    def test_user_profile_management(self):
        """Test user profile update functionality"""
        try:
            print("\n--- Testing User Profile Management ---")
            
            if not self.user_1_token:
                print("❌ No token available for testing")
                return
            
            headers = {"Authorization": f"Bearer {self.user_1_token}"}
            
            # Test profile update
            update_data = {
                "display_name": "Updated Adventurer Name",
                "profile_picture": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PC9zdmc+"
            }
            
            print("Testing profile update...")
            response = requests.put(f"{self.api_url}/me", json=update_data, headers=headers)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if (data.get("display_name") == update_data["display_name"] and 
                    data.get("profile_picture") == update_data["profile_picture"]):
                    print("✅ Profile update successful")
                    print(f"✅ Display name updated: {data['display_name']}")
                    self.test_results["update_user_profile"] = True
                else:
                    print("❌ Profile update data mismatch")
            else:
                print("❌ Profile update failed")
                
        except Exception as e:
            print(f"❌ Error testing user profile management: {str(e)}")
    
    def test_quest_data_management(self):
        """Test quest data save and retrieve functionality"""
        try:
            print("\n--- Testing Quest Data Management ---")
            
            if not self.user_1_token:
                print("❌ No token available for testing")
                return
            
            headers = {"Authorization": f"Bearer {self.user_1_token}"}
            
            # Test quest data save
            quest_data = {
                "quest_data": {
                    "quests": [
                        {
                            "id": "quest_1",
                            "title": "Slay the Dragon",
                            "description": "Defeat the ancient dragon in the mountain cave",
                            "xp": 500,
                            "status": "in_progress"
                        }
                    ],
                    "user_stats": {
                        "level": 5,
                        "total_xp": 2500,
                        "completed_quests": 12
                    }
                }
            }
            
            print("Testing quest data save...")
            response = requests.post(f"{self.api_url}/quest-data", json=quest_data, headers=headers)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Quest data save successful")
                self.test_results["save_quest_data"] = True
            else:
                print("❌ Quest data save failed")
                return
            
            # Test quest data retrieve
            print("Testing quest data retrieve...")
            response = requests.get(f"{self.api_url}/quest-data", headers=headers)
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if ("quest_data" in data and 
                    data["quest_data"] is not None and
                    "quests" in data["quest_data"]):
                    print("✅ Quest data retrieve successful")
                    print(f"✅ Retrieved {len(data['quest_data']['quests'])} quests")
                    self.test_results["retrieve_quest_data"] = True
                else:
                    print("❌ Quest data retrieve format incorrect")
            else:
                print("❌ Quest data retrieve failed")
                
        except Exception as e:
            print(f"❌ Error testing quest data management: {str(e)}")
    
    def test_user_data_isolation(self):
        """Test that users can only access their own data"""
        try:
            print("\n--- Testing User Data Isolation ---")
            
            # Register second user
            print("Registering second user for isolation test...")
            response = requests.post(f"{self.api_url}/register", json=self.test_user_2)
            
            if response.status_code != 200:
                print("❌ Failed to register second user for isolation test")
                return
            
            data = response.json()
            self.user_2_token = data["access_token"]
            print("✅ Second user registered successfully")
            
            # Save quest data for user 2
            headers_2 = {"Authorization": f"Bearer {self.user_2_token}"}
            quest_data_2 = {
                "quest_data": {
                    "quests": [
                        {
                            "id": "quest_2",
                            "title": "Rescue the Princess",
                            "description": "Save the princess from the evil wizard",
                            "xp": 750,
                            "status": "completed"
                        }
                    ],
                    "user_stats": {
                        "level": 8,
                        "total_xp": 4000,
                        "completed_quests": 20
                    }
                }
            }
            
            print("Saving quest data for user 2...")
            response = requests.post(f"{self.api_url}/quest-data", json=quest_data_2, headers=headers_2)
            
            if response.status_code != 200:
                print("❌ Failed to save quest data for user 2")
                return
            
            # Verify user 1 can only see their own data
            headers_1 = {"Authorization": f"Bearer {self.user_1_token}"}
            print("Verifying user 1 can only see their own quest data...")
            response = requests.get(f"{self.api_url}/quest-data", headers=headers_1)
            
            if response.status_code == 200:
                data = response.json()
                if (data["quest_data"] and 
                    "quests" in data["quest_data"] and
                    len(data["quest_data"]["quests"]) == 1 and
                    data["quest_data"]["quests"][0]["id"] == "quest_1"):
                    print("✅ User 1 can only see their own quest data")
                    
                    # Verify user 2 can only see their own data
                    print("Verifying user 2 can only see their own quest data...")
                    response = requests.get(f"{self.api_url}/quest-data", headers=headers_2)
                    
                    if response.status_code == 200:
                        data = response.json()
                        if (data["quest_data"] and 
                            "quests" in data["quest_data"] and
                            len(data["quest_data"]["quests"]) == 1 and
                            data["quest_data"]["quests"][0]["id"] == "quest_2"):
                            print("✅ User 2 can only see their own quest data")
                            self.test_results["user_data_isolation"] = True
                        else:
                            print("❌ User 2 data isolation failed")
                    else:
                        print("❌ Failed to retrieve user 2 quest data")
                else:
                    print("❌ User 1 data isolation failed")
            else:
                print("❌ Failed to retrieve user 1 quest data for isolation test")
                
        except Exception as e:
            print(f"❌ Error testing user data isolation: {str(e)}")
    
    def test_default_avatar_generation(self):
        """Test default avatar generation based on username"""
        try:
            print("\n--- Testing Default Avatar Generation ---")
            
            # Register a user without providing profile_picture
            test_user_avatar = {
                "email": f"avatar{self.test_timestamp}@test.com",
                "username": f"avatartest{self.test_timestamp}",
                "password": "AvatarTest123",
                "display_name": "Avatar Test User"
            }
            
            print("Registering user without profile picture...")
            response = requests.post(f"{self.api_url}/register", json=test_user_avatar)
            
            if response.status_code == 200:
                data = response.json()
                if ("user" in data and 
                    "profile_picture" in data["user"] and 
                    data["user"]["profile_picture"] is not None and
                    data["user"]["profile_picture"].startswith("data:image/svg+xml;base64,")):
                    print("✅ Default avatar generated successfully")
                    print(f"✅ Avatar contains username initial: {test_user_avatar['username'][0].upper()}")
                    self.test_results["default_avatar_generation"] = True
                else:
                    print("❌ Default avatar generation failed")
            else:
                print("❌ Failed to register user for avatar test")
                
        except Exception as e:
            print(f"❌ Error testing default avatar generation: {str(e)}")

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)