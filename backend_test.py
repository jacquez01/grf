#!/usr/bin/env python3

import requests
import json
import sys
from urllib.parse import unquote

# Backend URL from frontend/.env
BACKEND_URL = "https://agrf-global-bridge.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test 1: GET /api/ - confirm notify array has THREE emails"""
    print("=== Test 1: Root endpoint notify array ===")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            expected_emails = ["info@globerelations.org", "info@grfus.org", "jaceowie@gmail.com"]
            notify_emails = data.get("notify", [])
            
            if set(notify_emails) == set(expected_emails) and len(notify_emails) == 3:
                print("✅ PASS: Notify array contains all three required emails")
                return True
            else:
                print(f"❌ FAIL: Expected {expected_emails}, got {notify_emails}")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_volunteer_application_success():
    """Test 2: POST /api/volunteer-application with valid data"""
    print("\n=== Test 2: Volunteer application success ===")
    try:
        payload = {
            "name": "John Volunteer",
            "email": "jv@test.com",
            "phone": "555-0101",
            "country": "United States",
            "region": "New York",
            "profession": "Teacher",
            "mode": "In-Person",
            "availability": "Weekends",
            "message": "Happy to help."
        }
        
        response = requests.post(f"{BACKEND_URL}/volunteer-application", json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Check required fields
            required_fields = ["id", "ok", "notify_to", "mailto"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ FAIL: Missing fields: {missing_fields}")
                return False
            
            # Check notify_to has all 3 emails
            expected_emails = ["info@globerelations.org", "info@grfus.org", "jaceowie@gmail.com"]
            if set(data["notify_to"]) != set(expected_emails):
                print(f"❌ FAIL: notify_to expected {expected_emails}, got {data['notify_to']}")
                return False
            
            # Check mailto subject starts with [AGRF Volunteer Application]
            mailto = data["mailto"]
            if "subject=" in mailto:
                subject_part = mailto.split("subject=")[1].split("&")[0]
                subject = unquote(subject_part)
                if not subject.startswith("[AGRF Volunteer Application]"):
                    print(f"❌ FAIL: Subject should start with '[AGRF Volunteer Application]', got: {subject}")
                    return False
            else:
                print("❌ FAIL: No subject found in mailto")
                return False
            
            # Check body contains country, profession, and mode
            if "body=" in mailto:
                body_part = mailto.split("body=")[1]
                body = unquote(body_part)
                required_in_body = ["United States", "Teacher", "In-Person"]
                missing_in_body = [item for item in required_in_body if item not in body]
                
                if missing_in_body:
                    print(f"❌ FAIL: Body missing: {missing_in_body}")
                    print(f"Body content: {body}")
                    return False
            else:
                print("❌ FAIL: No body found in mailto")
                return False
            
            print("✅ PASS: Volunteer application created successfully with correct format")
            return True
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_volunteer_application_missing_country():
    """Test 3: POST /api/volunteer-application missing country - expect 422"""
    print("\n=== Test 3: Volunteer application missing country ===")
    try:
        payload = {
            "name": "John Volunteer",
            "email": "jv@test.com",
            "phone": "555-0101",
            # "country": "United States",  # Missing required field
            "region": "New York",
            "profession": "Teacher",
            "mode": "In-Person",
            "availability": "Weekends",
            "message": "Happy to help."
        }
        
        response = requests.post(f"{BACKEND_URL}/volunteer-application", json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 422:
            print("✅ PASS: Correctly returned 422 for missing country")
            return True
        else:
            print(f"❌ FAIL: Expected 422, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_volunteer_application_invalid_email():
    """Test 4: POST /api/volunteer-application with invalid email - expect 422"""
    print("\n=== Test 4: Volunteer application invalid email ===")
    try:
        payload = {
            "name": "John Volunteer",
            "email": "invalid-email",  # Invalid email format
            "phone": "555-0101",
            "country": "United States",
            "region": "New York",
            "profession": "Teacher",
            "mode": "In-Person",
            "availability": "Weekends",
            "message": "Happy to help."
        }
        
        response = requests.post(f"{BACKEND_URL}/volunteer-application", json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 422:
            print("✅ PASS: Correctly returned 422 for invalid email")
            return True
        else:
            print(f"❌ FAIL: Expected 422, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_volunteer_application_list():
    """Test 5: GET /api/volunteer-application - returns list including entry from test 2"""
    print("\n=== Test 5: Volunteer application list ===")
    try:
        response = requests.get(f"{BACKEND_URL}/volunteer-application")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} volunteer applications")
            
            # Look for our test entry
            test_entry = None
            for entry in data:
                if entry.get("name") == "John Volunteer" and entry.get("email") == "jv@test.com":
                    test_entry = entry
                    break
            
            if test_entry:
                print("✅ PASS: Found test volunteer application in list")
                print(f"Entry: {json.dumps(test_entry, indent=2)}")
                return True
            else:
                print("❌ FAIL: Test volunteer application not found in list")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_ambassador_application_success():
    """Test 6: POST /api/ambassador-application with valid data"""
    print("\n=== Test 6: Ambassador application success ===")
    try:
        payload = {
            "name": "Ada Amb",
            "email": "ada@test.com",
            "phone": "",
            "country": "Nigeria",
            "track": "Public Diplomat",
            "message": "Advocating for women's health."
        }
        
        response = requests.post(f"{BACKEND_URL}/ambassador-application", json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Check mailto subject starts with [AGRF Public Diplomat]
            mailto = data["mailto"]
            if "subject=" in mailto:
                subject_part = mailto.split("subject=")[1].split("&")[0]
                subject = unquote(subject_part)
                if not subject.startswith("[AGRF Public Diplomat]"):
                    print(f"❌ FAIL: Subject should start with '[AGRF Public Diplomat]', got: {subject}")
                    return False
                
                # Check subject includes track
                if "Public Diplomat" not in subject:
                    print(f"❌ FAIL: Subject should include track 'Public Diplomat', got: {subject}")
                    return False
            else:
                print("❌ FAIL: No subject found in mailto")
                return False
            
            print("✅ PASS: Ambassador application created successfully with correct format")
            return True
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_ambassador_application_nomination():
    """Test 7: POST /api/ambassador-application with nomination track"""
    print("\n=== Test 7: Ambassador application with nomination ===")
    try:
        payload = {
            "name": "Nominator Name",
            "email": "nominator@test.com",
            "phone": "555-0202",
            "country": "Kenya",
            "track": "Nomination",
            "nominee_name": "Jane Leader",
            "message": "Nominating Jane for her leadership."
        }
        
        response = requests.post(f"{BACKEND_URL}/ambassador-application", json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Check body includes nominee_name
            mailto = data["mailto"]
            if "body=" in mailto:
                body_part = mailto.split("body=")[1]
                body = unquote(body_part)
                
                if "Jane Leader" not in body:
                    print(f"❌ FAIL: Body should include nominee_name 'Jane Leader'")
                    print(f"Body content: {body}")
                    return False
            else:
                print("❌ FAIL: No body found in mailto")
                return False
            
            print("✅ PASS: Ambassador nomination created successfully with nominee_name in body")
            return True
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_ambassador_application_missing_track():
    """Test 8: POST /api/ambassador-application missing track - expect 422"""
    print("\n=== Test 8: Ambassador application missing track ===")
    try:
        payload = {
            "name": "Ada Amb",
            "email": "ada@test.com",
            "phone": "",
            "country": "Nigeria",
            # "track": "Public Diplomat",  # Missing required field
            "message": "Advocating for women's health."
        }
        
        response = requests.post(f"{BACKEND_URL}/ambassador-application", json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 422:
            print("✅ PASS: Correctly returned 422 for missing track")
            return True
        else:
            print(f"❌ FAIL: Expected 422, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_ambassador_application_list():
    """Test 9: GET /api/ambassador-application - returns list including entries"""
    print("\n=== Test 9: Ambassador application list ===")
    try:
        response = requests.get(f"{BACKEND_URL}/ambassador-application")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} ambassador applications")
            
            # Look for our test entries
            ada_entry = None
            nomination_entry = None
            
            for entry in data:
                if entry.get("name") == "Ada Amb" and entry.get("email") == "ada@test.com":
                    ada_entry = entry
                elif entry.get("nominee_name") == "Jane Leader":
                    nomination_entry = entry
            
            if ada_entry and nomination_entry:
                print("✅ PASS: Found both test ambassador applications in list")
                return True
            elif ada_entry:
                print("⚠️ PARTIAL: Found Ada entry but not nomination entry")
                return True
            elif nomination_entry:
                print("⚠️ PARTIAL: Found nomination entry but not Ada entry")
                return True
            else:
                print("❌ FAIL: Test ambassador applications not found in list")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_regression_endpoints():
    """Test 10: Regression test for existing endpoints"""
    print("\n=== Test 10: Regression testing existing endpoints ===")
    
    results = []
    
    # Test contact endpoint
    print("Testing POST /api/contact...")
    try:
        contact_payload = {
            "name": "Test Contact",
            "email": "test@contact.com",
            "subject": "Test Subject",
            "message": "Test message"
        }
        response = requests.post(f"{BACKEND_URL}/contact", json=contact_payload)
        if response.status_code == 200:
            print("✅ Contact endpoint working")
            results.append(True)
        else:
            print(f"❌ Contact endpoint failed: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ Contact endpoint error: {e}")
        results.append(False)
    
    # Test proposal endpoint
    print("Testing POST /api/proposal...")
    try:
        proposal_payload = {
            "organization": "Test Org",
            "name": "Test Proposer",
            "email": "test@proposal.com",
            "message": "Test proposal"
        }
        response = requests.post(f"{BACKEND_URL}/proposal", json=proposal_payload)
        if response.status_code == 200:
            print("✅ Proposal endpoint working")
            results.append(True)
        else:
            print(f"❌ Proposal endpoint failed: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ Proposal endpoint error: {e}")
        results.append(False)
    
    # Test mentor-signup endpoint
    print("Testing POST /api/mentor-signup...")
    try:
        mentor_payload = {
            "name": "Test Mentor",
            "email": "test@mentor.com",
            "role": "Mentor",
            "center": "Test Center",
            "message": "Test mentor signup"
        }
        response = requests.post(f"{BACKEND_URL}/mentor-signup", json=mentor_payload)
        if response.status_code == 200:
            print("✅ Mentor-signup endpoint working")
            results.append(True)
        else:
            print(f"❌ Mentor-signup endpoint failed: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ Mentor-signup endpoint error: {e}")
        results.append(False)
    
    if all(results):
        print("✅ PASS: All regression tests passed")
        return True
    else:
        print(f"❌ FAIL: {len([r for r in results if not r])} out of {len(results)} regression tests failed")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting AGRF Backend API Tests")
    print(f"Testing against: {BACKEND_URL}")
    print("=" * 60)
    
    tests = [
        test_root_endpoint,
        test_volunteer_application_success,
        test_volunteer_application_missing_country,
        test_volunteer_application_invalid_email,
        test_volunteer_application_list,
        test_ambassador_application_success,
        test_ambassador_application_nomination,
        test_ambassador_application_missing_track,
        test_ambassador_application_list,
        test_regression_endpoints
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            results.append(False)
    
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    for i, (test, result) in enumerate(zip(tests, results), 1):
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"Test {i:2d}: {status} - {test.__name__}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {total - passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())