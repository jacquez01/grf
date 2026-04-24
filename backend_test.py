#!/usr/bin/env python3

import requests
import json
import sys
from typing import Dict, Any

# Backend URL from frontend/.env
BACKEND_URL = "https://agrf-global-bridge.preview.emergentagent.com/api"

def test_petition_endpoints():
    """Test all AGRF Petition endpoints as specified in the review request"""
    
    print("🧪 Testing AGRF Petition Endpoints")
    print("=" * 50)
    
    results = []
    captured_slug = None
    captured_slug_2 = None
    
    # Test 1: POST /api/petitions - Create first petition
    print("\n1. Testing POST /api/petitions - Create first petition")
    petition_data = {
        "title": "Protect Clean Drinking Water",
        "creator_name": "Ada Lovelace",
        "creator_email": "ada@test.com",
        "category": "Public health and community development",
        "target": "United Nations",
        "summary": "A call to protect drinking water globally.",
        "full_text": "More detail here.",
        "country": "Global"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/petitions", json=petition_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Validate response structure
            required_fields = ["id", "slug", "signature_count", "featured_in_newsroom", "title", "creator_name"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                results.append(f"❌ Test 1 FAILED: Missing fields {missing_fields}")
            elif data["signature_count"] != 0:
                results.append(f"❌ Test 1 FAILED: Expected signature_count=0, got {data['signature_count']}")
            elif data["featured_in_newsroom"] != False:
                results.append(f"❌ Test 1 FAILED: Expected featured_in_newsroom=false, got {data['featured_in_newsroom']}")
            else:
                captured_slug = data["slug"]
                results.append(f"✅ Test 1 PASSED: Petition created with slug '{captured_slug}'")
        else:
            results.append(f"❌ Test 1 FAILED: Expected 200, got {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        results.append(f"❌ Test 1 FAILED: Exception {str(e)}")
    
    # Test 2: POST /api/petitions - Create duplicate title (should get different slug)
    print("\n2. Testing POST /api/petitions - Duplicate title (unique slug logic)")
    try:
        response = requests.post(f"{BACKEND_URL}/petitions", json=petition_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if captured_slug and data["slug"] != captured_slug:
                captured_slug_2 = data["slug"]
                if data["slug"].endswith("-2"):
                    results.append(f"✅ Test 2 PASSED: Unique slug generated '{data['slug']}'")
                else:
                    results.append(f"✅ Test 2 PASSED: Different slug generated '{data['slug']}' (not ending with -2 but still unique)")
            else:
                results.append(f"❌ Test 2 FAILED: Expected different slug, got same slug '{data['slug']}'")
        else:
            results.append(f"❌ Test 2 FAILED: Expected 200, got {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        results.append(f"❌ Test 2 FAILED: Exception {str(e)}")
    
    # Test 3: GET /api/petitions - List petitions (sorted by signature_count desc)
    print("\n3. Testing GET /api/petitions - List petitions")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: Found {len(data)} petitions")
            
            if len(data) >= 2:
                # Check if sorted by signature_count desc
                is_sorted = all(data[i]["signature_count"] >= data[i+1]["signature_count"] for i in range(len(data)-1))
                if is_sorted:
                    results.append(f"✅ Test 3 PASSED: Found {len(data)} petitions, sorted by signature_count desc")
                else:
                    results.append(f"❌ Test 3 FAILED: Petitions not sorted by signature_count desc")
            else:
                results.append(f"❌ Test 3 FAILED: Expected at least 2 petitions, got {len(data)}")
        else:
            results.append(f"❌ Test 3 FAILED: Expected 200, got {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        results.append(f"❌ Test 3 FAILED: Exception {str(e)}")
    
    # Test 4: GET /api/petitions/{slug} - Get specific petition
    print(f"\n4. Testing GET /api/petitions/{captured_slug} - Get specific petition")
    if captured_slug:
        try:
            response = requests.get(f"{BACKEND_URL}/petitions/{captured_slug}")
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                if data["title"] == petition_data["title"]:
                    results.append(f"✅ Test 4 PASSED: Retrieved petition with correct title")
                else:
                    results.append(f"❌ Test 4 FAILED: Title mismatch")
            else:
                results.append(f"❌ Test 4 FAILED: Expected 200, got {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            results.append(f"❌ Test 4 FAILED: Exception {str(e)}")
    else:
        results.append(f"❌ Test 4 SKIPPED: No captured slug from Test 1")
    
    # Test 5: GET /api/petitions/nonexistent-slug - Should return 404
    print("\n5. Testing GET /api/petitions/nonexistent-slug - Should return 404")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions/nonexistent-slug")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 404:
            results.append(f"✅ Test 5 PASSED: Correctly returned 404 for nonexistent slug")
        else:
            results.append(f"❌ Test 5 FAILED: Expected 404, got {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        results.append(f"❌ Test 5 FAILED: Exception {str(e)}")
    
    # Test 6: POST /api/petitions/{slug}/sign - First signature
    print(f"\n6. Testing POST /api/petitions/{captured_slug}/sign - First signature")
    if captured_slug:
        sign_data = {
            "name": "Signer One",
            "email": "s1@test.com",
            "country": "USA",
            "comment": "I support this."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/petitions/{captured_slug}/sign", json=sign_data)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                expected_fields = ["ok", "duplicate", "signature_count", "slug", "featured_in_newsroom"]
                missing_fields = [field for field in expected_fields if field not in data]
                
                if missing_fields:
                    results.append(f"❌ Test 6 FAILED: Missing fields {missing_fields}")
                elif data["ok"] != True or data["duplicate"] != False or data["signature_count"] != 1:
                    results.append(f"❌ Test 6 FAILED: Unexpected values - ok:{data['ok']}, duplicate:{data['duplicate']}, count:{data['signature_count']}")
                else:
                    results.append(f"✅ Test 6 PASSED: First signature added successfully")
            else:
                results.append(f"❌ Test 6 FAILED: Expected 200, got {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            results.append(f"❌ Test 6 FAILED: Exception {str(e)}")
    else:
        results.append(f"❌ Test 6 SKIPPED: No captured slug from Test 1")
    
    # Test 7: POST /api/petitions/{slug}/sign - Duplicate email
    print(f"\n7. Testing POST /api/petitions/{captured_slug}/sign - Duplicate email")
    if captured_slug:
        try:
            response = requests.post(f"{BACKEND_URL}/petitions/{captured_slug}/sign", json=sign_data)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                if data["duplicate"] == True and data["signature_count"] == 1:
                    results.append(f"✅ Test 7 PASSED: Duplicate signature detected, count unchanged")
                else:
                    results.append(f"❌ Test 7 FAILED: Expected duplicate=true and count=1, got duplicate:{data['duplicate']}, count:{data['signature_count']}")
            else:
                results.append(f"❌ Test 7 FAILED: Expected 200, got {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            results.append(f"❌ Test 7 FAILED: Exception {str(e)}")
    else:
        results.append(f"❌ Test 7 SKIPPED: No captured slug from Test 1")
    
    # Test 8: POST /api/petitions/{slug}/sign - Different email
    print(f"\n8. Testing POST /api/petitions/{captured_slug}/sign - Different email")
    if captured_slug:
        sign_data_2 = {
            "name": "Signer Two",
            "email": "s2@test.com",
            "country": "Canada",
            "comment": "Great cause!"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/petitions/{captured_slug}/sign", json=sign_data_2)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                if data["signature_count"] == 2 and data["duplicate"] == False:
                    results.append(f"✅ Test 8 PASSED: Second signature added, count now 2")
                else:
                    results.append(f"❌ Test 8 FAILED: Expected count=2 and duplicate=false, got count:{data['signature_count']}, duplicate:{data['duplicate']}")
            else:
                results.append(f"❌ Test 8 FAILED: Expected 200, got {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            results.append(f"❌ Test 8 FAILED: Exception {str(e)}")
    else:
        results.append(f"❌ Test 8 SKIPPED: No captured slug from Test 1")
    
    # Test 9: GET /api/petitions/{slug}/signatures - List signatures
    print(f"\n9. Testing GET /api/petitions/{captured_slug}/signatures - List signatures")
    if captured_slug:
        try:
            response = requests.get(f"{BACKEND_URL}/petitions/{captured_slug}/signatures")
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: Found {len(data)} signatures")
                
                if len(data) == 2:
                    # Check if signatures have required fields
                    required_sig_fields = ["id", "name", "email", "petition_id", "created_at"]
                    all_valid = all(all(field in sig for field in required_sig_fields) for sig in data)
                    
                    if all_valid:
                        results.append(f"✅ Test 9 PASSED: Found 2 signatures with correct structure")
                    else:
                        results.append(f"❌ Test 9 FAILED: Signatures missing required fields")
                else:
                    results.append(f"❌ Test 9 FAILED: Expected 2 signatures, got {len(data)}")
            else:
                results.append(f"❌ Test 9 FAILED: Expected 200, got {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            results.append(f"❌ Test 9 FAILED: Exception {str(e)}")
    else:
        results.append(f"❌ Test 9 SKIPPED: No captured slug from Test 1")
    
    # Test 10: Feature threshold verification (code inspection + manual test)
    print(f"\n10. Testing feature threshold logic")
    try:
        # First check if NEWSROOM_FEATURE_THRESHOLD exists in code
        with open('/app/backend/server.py', 'r') as f:
            server_code = f.read()
            
        if 'NEWSROOM_FEATURE_THRESHOLD' in server_code and '5000' in server_code:
            print("✅ Code inspection: NEWSROOM_FEATURE_THRESHOLD = 5000 found in server.py")
            
            # Now test with additional signatures to verify logic (but not reaching 5000)
            if captured_slug:
                additional_emails = ["s3@test.com", "s4@test.com", "s5@test.com", "s6@test.com", "s7@test.com"]
                current_count = 2
                
                for i, email in enumerate(additional_emails):
                    sign_data_extra = {
                        "name": f"Signer {i+3}",
                        "email": email,
                        "country": "Test Country",
                        "comment": f"Test signature {i+3}"
                    }
                    
                    response = requests.post(f"{BACKEND_URL}/petitions/{captured_slug}/sign", json=sign_data_extra)
                    if response.status_code == 200:
                        data = response.json()
                        current_count = data["signature_count"]
                        if data["featured_in_newsroom"] == True and current_count < 5000:
                            results.append(f"❌ Test 10 FAILED: featured_in_newsroom=true at count {current_count}, should be false until 5000")
                            break
                    else:
                        results.append(f"❌ Test 10 FAILED: Error adding signature {i+3}: {response.status_code}")
                        break
                else:
                    # All signatures added successfully and featured_in_newsroom is still false
                    results.append(f"✅ Test 10 PASSED: Threshold logic verified - featured_in_newsroom=false at count {current_count}")
            else:
                results.append(f"❌ Test 10 FAILED: No captured slug for testing")
        else:
            results.append(f"❌ Test 10 FAILED: NEWSROOM_FEATURE_THRESHOLD = 5000 not found in server.py")
    except Exception as e:
        results.append(f"❌ Test 10 FAILED: Exception {str(e)}")
    
    # Test 11: Validation tests
    print(f"\n11. Testing validation - Missing title")
    invalid_petition = {
        "creator_name": "Test Creator",
        "creator_email": "test@test.com",
        "category": "Test",
        "target": "Test Target",
        "summary": "Test summary"
        # Missing title
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/petitions", json=invalid_petition)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 422:
            results.append(f"✅ Test 11a PASSED: Validation correctly rejected missing title (422)")
        else:
            results.append(f"❌ Test 11a FAILED: Expected 422 for missing title, got {response.status_code}")
    except Exception as e:
        results.append(f"❌ Test 11a FAILED: Exception {str(e)}")
    
    # Test 11b: Invalid email in signature
    print(f"\n11b. Testing validation - Invalid email in signature")
    if captured_slug:
        invalid_sign = {
            "name": "Test Signer",
            "email": "invalid-email",  # Invalid email format
            "country": "Test",
            "comment": "Test"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/petitions/{captured_slug}/sign", json=invalid_sign)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 422:
                results.append(f"✅ Test 11b PASSED: Validation correctly rejected invalid email (422)")
            else:
                results.append(f"❌ Test 11b FAILED: Expected 422 for invalid email, got {response.status_code}")
        except Exception as e:
            results.append(f"❌ Test 11b FAILED: Exception {str(e)}")
    else:
        results.append(f"❌ Test 11b SKIPPED: No captured slug")
    
    # Test 12: Regression testing - Existing endpoints
    print(f"\n12. Testing regression - Existing endpoints still work")
    
    # Test root endpoint
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            print("✅ GET /api/ - OK")
            regression_results = ["GET /api/ - OK"]
        else:
            print(f"❌ GET /api/ - FAILED ({response.status_code})")
            regression_results = [f"GET /api/ - FAILED ({response.status_code})"]
    except Exception as e:
        regression_results = [f"GET /api/ - FAILED ({str(e)})"]
    
    # Test contact endpoint
    try:
        contact_data = {
            "name": "Test Contact",
            "email": "test@test.com",
            "subject": "Test Subject",
            "message": "Test message"
        }
        response = requests.post(f"{BACKEND_URL}/contact", json=contact_data)
        if response.status_code == 200:
            print("✅ POST /api/contact - OK")
            regression_results.append("POST /api/contact - OK")
        else:
            print(f"❌ POST /api/contact - FAILED ({response.status_code})")
            regression_results.append(f"POST /api/contact - FAILED ({response.status_code})")
    except Exception as e:
        regression_results.append(f"POST /api/contact - FAILED ({str(e)})")
    
    # Test volunteer-application endpoint
    try:
        volunteer_data = {
            "name": "Test Volunteer",
            "email": "volunteer@test.com",
            "country": "Test Country",
            "profession": "Test Profession",
            "mode": "Online"
        }
        response = requests.post(f"{BACKEND_URL}/volunteer-application", json=volunteer_data)
        if response.status_code == 200:
            print("✅ POST /api/volunteer-application - OK")
            regression_results.append("POST /api/volunteer-application - OK")
        else:
            print(f"❌ POST /api/volunteer-application - FAILED ({response.status_code})")
            regression_results.append(f"POST /api/volunteer-application - FAILED ({response.status_code})")
    except Exception as e:
        regression_results.append(f"POST /api/volunteer-application - FAILED ({str(e)})")
    
    # Test ambassador-application endpoint
    try:
        ambassador_data = {
            "name": "Test Ambassador",
            "email": "ambassador@test.com",
            "track": "Public Diplomat"
        }
        response = requests.post(f"{BACKEND_URL}/ambassador-application", json=ambassador_data)
        if response.status_code == 200:
            print("✅ POST /api/ambassador-application - OK")
            regression_results.append("POST /api/ambassador-application - OK")
        else:
            print(f"❌ POST /api/ambassador-application - FAILED ({response.status_code})")
            regression_results.append(f"POST /api/ambassador-application - FAILED ({response.status_code})")
    except Exception as e:
        regression_results.append(f"POST /api/ambassador-application - FAILED ({str(e)})")
    
    # Test mentor-signup endpoint
    try:
        mentor_data = {
            "name": "Test Mentor",
            "email": "mentor@test.com",
            "role": "Mentor"
        }
        response = requests.post(f"{BACKEND_URL}/mentor-signup", json=mentor_data)
        if response.status_code == 200:
            print("✅ POST /api/mentor-signup - OK")
            regression_results.append("POST /api/mentor-signup - OK")
        else:
            print(f"❌ POST /api/mentor-signup - FAILED ({response.status_code})")
            regression_results.append(f"POST /api/mentor-signup - FAILED ({response.status_code})")
    except Exception as e:
        regression_results.append(f"POST /api/mentor-signup - FAILED ({str(e)})")
    
    if all("OK" in result for result in regression_results):
        results.append(f"✅ Test 12 PASSED: All existing endpoints working correctly")
    else:
        failed_endpoints = [result for result in regression_results if "FAILED" in result]
        results.append(f"❌ Test 12 FAILED: Some endpoints failed - {failed_endpoints}")
    
    # Summary
    print("\n" + "=" * 50)
    print("🏁 PETITION ENDPOINTS TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for result in results if result.startswith("✅"))
    failed = sum(1 for result in results if result.startswith("❌"))
    skipped = sum(1 for result in results if "SKIPPED" in result)
    
    for result in results:
        print(result)
    
    print(f"\nTotal: {len(results)} tests")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"⏭️ Skipped: {skipped}")
    
    return failed == 0

if __name__ == "__main__":
    success = test_petition_endpoints()
    sys.exit(0 if success else 1)