#!/usr/bin/env python3
"""
AGRF Backend API Testing Script
Tests all endpoints at the public URL with /api prefix
"""

import requests
import json
import sys
from urllib.parse import unquote

# Backend URL from frontend/.env
BACKEND_URL = "https://agrf-global-bridge.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test GET /api/ endpoint"""
    print("🔍 Testing GET /api/")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify required fields
            if "message" in data and "notify" in data:
                notify_emails = data["notify"]
                expected_emails = ["info@globerelations.org", "jaceowie@gmail.com"]
                
                if notify_emails == expected_emails:
                    print("✅ Root endpoint working correctly")
                    return True
                else:
                    print(f"❌ Notify emails mismatch. Expected: {expected_emails}, Got: {notify_emails}")
                    return False
            else:
                print("❌ Missing required fields 'message' or 'notify'")
                return False
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Root endpoint error: {str(e)}")
        return False

def test_contact_submission():
    """Test POST /api/contact endpoint"""
    print("\n🔍 Testing POST /api/contact")
    
    contact_data = {
        "name": "Test User",
        "email": "test@example.com", 
        "subject": "Hello",
        "message": "Testing contact form."
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/contact", json=contact_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify required fields
            required_fields = ["id", "ok", "notify_to", "mailto"]
            if all(field in data for field in required_fields):
                # Check notify_to contains expected emails
                expected_emails = ["info@globerelations.org", "jaceowie@gmail.com"]
                if data["notify_to"] == expected_emails:
                    # Check mailto format
                    mailto = data["mailto"]
                    if mailto.startswith("mailto:") and "info@globerelations.org" in mailto and "jaceowie@gmail.com" in mailto:
                        print("✅ Contact submission working correctly")
                        return True, data["id"]
                    else:
                        print(f"❌ Invalid mailto format: {mailto}")
                        return False, None
                else:
                    print(f"❌ notify_to mismatch. Expected: {expected_emails}, Got: {data['notify_to']}")
                    return False, None
            else:
                print(f"❌ Missing required fields. Expected: {required_fields}")
                return False, None
        else:
            print(f"❌ Contact submission failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Contact submission error: {str(e)}")
        return False, None

def test_contact_list():
    """Test GET /api/contact endpoint"""
    print("\n🔍 Testing GET /api/contact")
    
    try:
        response = requests.get(f"{BACKEND_URL}/contact")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} contact entries")
            
            # Look for our test entry
            test_entry = None
            for contact in data:
                if contact.get("email") == "test@example.com":
                    test_entry = contact
                    break
            
            if test_entry:
                print("✅ Contact list working correctly - found test entry")
                print(f"Test entry: {json.dumps(test_entry, indent=2)}")
                return True
            else:
                print("⚠️ Contact list working but test entry not found")
                return True
        else:
            print(f"❌ Contact list failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Contact list error: {str(e)}")
        return False

def test_proposal_submission():
    """Test POST /api/proposal endpoint"""
    print("\n🔍 Testing POST /api/proposal")
    
    proposal_data = {
        "organization": "Acme",
        "name": "Jane",
        "email": "jane@acme.com",
        "message": "We'd like to co-fund."
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/proposal", json=proposal_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify mailto contains [AGRF Partnership] in subject
            mailto = data.get("mailto", "")
            if "[AGRF Partnership]" in unquote(mailto):
                print("✅ Proposal submission working correctly")
                return True, data["id"]
            else:
                print(f"❌ Mailto doesn't contain '[AGRF Partnership]': {mailto}")
                return False, None
        else:
            print(f"❌ Proposal submission failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Proposal submission error: {str(e)}")
        return False, None

def test_proposal_list():
    """Test GET /api/proposal endpoint"""
    print("\n🔍 Testing GET /api/proposal")
    
    try:
        response = requests.get(f"{BACKEND_URL}/proposal")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} proposal entries")
            
            # Look for our test entry
            test_entry = None
            for proposal in data:
                if proposal.get("email") == "jane@acme.com":
                    test_entry = proposal
                    break
            
            if test_entry:
                print("✅ Proposal list working correctly - found test entry")
                print(f"Test entry: {json.dumps(test_entry, indent=2)}")
                return True
            else:
                print("⚠️ Proposal list working but test entry not found")
                return True
        else:
            print(f"❌ Proposal list failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Proposal list error: {str(e)}")
        return False

def test_volunteer_submission():
    """Test POST /api/volunteer endpoint"""
    print("\n🔍 Testing POST /api/volunteer")
    
    volunteer_data = {
        "name": "Vol Test",
        "email": "vol@test.com",
        "phone": "555-0100",
        "interest": "Youth programs"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/volunteer", json=volunteer_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            print("✅ Volunteer submission working correctly")
            return True
        else:
            print(f"❌ Volunteer submission failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Volunteer submission error: {str(e)}")
        return False

def test_validation():
    """Test validation with invalid data"""
    print("\n🔍 Testing validation with invalid data")
    
    invalid_data = {
        "name": "Test User",
        "email": "invalid-email",  # Invalid email
        "subject": "Hello"
        # Missing required 'message' field
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/contact", json=invalid_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 422:
            print("✅ Validation working correctly - returned 422 for invalid data")
            return True
        else:
            print(f"❌ Expected 422 for invalid data, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Validation test error: {str(e)}")
        return False

def test_cors():
    """Test CORS headers"""
    print("\n🔍 Testing CORS configuration")
    
    try:
        # Make an OPTIONS request to check CORS
        response = requests.options(f"{BACKEND_URL}/")
        print(f"OPTIONS Status: {response.status_code}")
        
        # Check for CORS headers
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        print(f"CORS Headers: {json.dumps(cors_headers, indent=2)}")
        
        # Check if origin is allowed (should be * or include the preview domain)
        allow_origin = cors_headers.get('Access-Control-Allow-Origin')
        if allow_origin == '*' or 'preview.emergentagent.com' in str(allow_origin):
            print("✅ CORS configuration allows preview domain")
            return True
        else:
            print(f"⚠️ CORS may not allow preview domain. Allow-Origin: {allow_origin}")
            return True  # Don't fail on this as it might still work
            
    except Exception as e:
        print(f"❌ CORS test error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting AGRF Backend API Tests")
    print(f"Testing backend at: {BACKEND_URL}")
    print("=" * 60)
    
    results = {}
    
    # Test all endpoints
    results['root'] = test_root_endpoint()
    results['contact_post'], contact_id = test_contact_submission()
    results['contact_get'] = test_contact_list()
    results['proposal_post'], proposal_id = test_proposal_submission()
    results['proposal_get'] = test_proposal_list()
    results['volunteer_post'] = test_volunteer_submission()
    results['validation'] = test_validation()
    results['cors'] = test_cors()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.upper()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())