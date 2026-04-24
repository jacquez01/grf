#!/usr/bin/env python3

import requests
import json
import sys
from typing import Dict, Any

# Backend URL from frontend/.env
BACKEND_URL = "https://agrf-global-bridge.preview.emergentagent.com/api"

def test_petition_approval_workflow():
    """Test the NEW AGRF petition approval workflow"""
    print("🧪 Testing AGRF Petition Approval Workflow")
    print("=" * 60)
    
    results = []
    
    # Test 1: GET /api/petitions - expect 3 approved seeded petitions
    print("\n1️⃣ Testing GET /api/petitions for seeded approved petitions...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions")
        if response.status_code == 200:
            petitions = response.json()
            print(f"   ✅ Status: {response.status_code}")
            print(f"   📊 Found {len(petitions)} petitions")
            
            # Check for the 3 specific seeded petitions
            expected_titles = [
                "Protect Clean Drinking Water",
                "Youth Inclusion in Nation Building and Policy Processes", 
                "More Focus on Youth Empowerment in America and Around the World"
            ]
            expected_counts = [1000, 500, 1000]
            
            found_petitions = []
            for expected_title, expected_count in zip(expected_titles, expected_counts):
                found = False
                for petition in petitions:
                    if petition.get("title") == expected_title:
                        found = True
                        found_petitions.append(petition)
                        if petition.get("status") != "approved":
                            print(f"   ❌ Petition '{expected_title}' status is '{petition.get('status')}', expected 'approved'")
                            results.append(f"❌ Test 1 FAILED: Petition '{expected_title}' not approved")
                        elif petition.get("signature_count") != expected_count:
                            print(f"   ❌ Petition '{expected_title}' has {petition.get('signature_count')} signatures, expected {expected_count}")
                            results.append(f"❌ Test 1 FAILED: Petition '{expected_title}' wrong signature count")
                        else:
                            print(f"   ✅ Found '{expected_title}' with {expected_count} signatures, status: approved")
                        break
                
                if not found:
                    print(f"   ❌ Missing expected petition: '{expected_title}'")
                    results.append(f"❌ Test 1 FAILED: Missing petition '{expected_title}'")
            
            if len(found_petitions) == 3:
                results.append("✅ Test 1 PASSED: All 3 seeded petitions found with correct status and counts")
            else:
                results.append(f"❌ Test 1 FAILED: Found {len(found_petitions)}/3 expected petitions")
        else:
            print(f"   ❌ Status: {response.status_code}")
            results.append(f"❌ Test 1 FAILED: GET /api/petitions returned {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 1 FAILED: {e}")

    # Test 2: POST /api/petitions - create pending petition
    print("\n2️⃣ Testing POST /api/petitions to create pending petition...")
    pending_petition_data = {
        "title": "Test Approval Flow",
        "creator_name": "Tester",
        "creator_email": "t@test.com",
        "category": "Human rights and social justice",
        "target": "UN",
        "summary": "Testing approval."
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/petitions", json=pending_petition_data)
        if response.status_code == 200:
            created_petition = response.json()
            print(f"   ✅ Status: {response.status_code}")
            print(f"   📝 Created petition ID: {created_petition.get('id')}")
            print(f"   🔗 Slug: {created_petition.get('slug')}")
            
            # Verify status is pending and approval_token exists
            if created_petition.get("status") != "pending":
                print(f"   ❌ Status is '{created_petition.get('status')}', expected 'pending'")
                results.append("❌ Test 2 FAILED: Created petition status not 'pending'")
            elif not created_petition.get("approval_token"):
                print(f"   ❌ No approval_token found")
                results.append("❌ Test 2 FAILED: No approval_token in created petition")
            else:
                print(f"   ✅ Status: pending, approval_token: {created_petition.get('approval_token')[:8]}...")
                results.append("✅ Test 2 PASSED: Petition created with status=pending and approval_token")
                
                # Store for later tests
                test_slug = created_petition.get("slug")
                test_token = created_petition.get("approval_token")
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   📄 Response: {response.text}")
            results.append(f"❌ Test 2 FAILED: POST /api/petitions returned {response.status_code}")
            return results
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 2 FAILED: {e}")
        return results

    # Test 3: GET /api/petitions - pending petition should NOT appear
    print("\n3️⃣ Testing GET /api/petitions - pending petition should NOT appear...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions")
        if response.status_code == 200:
            petitions = response.json()
            pending_found = any(p.get("slug") == test_slug for p in petitions)
            if pending_found:
                print(f"   ❌ Pending petition '{test_slug}' appears in public list")
                results.append("❌ Test 3 FAILED: Pending petition appears in public list")
            else:
                print(f"   ✅ Pending petition '{test_slug}' correctly hidden from public list")
                results.append("✅ Test 3 PASSED: Pending petition hidden from public list")
        else:
            print(f"   ❌ Status: {response.status_code}")
            results.append(f"❌ Test 3 FAILED: GET /api/petitions returned {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 3 FAILED: {e}")

    # Test 4: GET /api/petitions?include_pending=true - pending petition should appear
    print("\n4️⃣ Testing GET /api/petitions?include_pending=true - pending petition should appear...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions?include_pending=true")
        if response.status_code == 200:
            petitions = response.json()
            pending_found = any(p.get("slug") == test_slug for p in petitions)
            if pending_found:
                print(f"   ✅ Pending petition '{test_slug}' appears with include_pending=true")
                results.append("✅ Test 4 PASSED: Pending petition appears with include_pending=true")
            else:
                print(f"   ❌ Pending petition '{test_slug}' not found with include_pending=true")
                results.append("❌ Test 4 FAILED: Pending petition not found with include_pending=true")
        else:
            print(f"   ❌ Status: {response.status_code}")
            results.append(f"❌ Test 4 FAILED: GET /api/petitions?include_pending=true returned {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 4 FAILED: {e}")

    # Test 5: GET /api/petitions/{slug_of_pending} - expect 404
    print(f"\n5️⃣ Testing GET /api/petitions/{test_slug} - expect 404 for pending petition...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions/{test_slug}")
        if response.status_code == 404:
            print(f"   ✅ Status: {response.status_code} (correctly blocked pending petition)")
            results.append("✅ Test 5 PASSED: Pending petition returns 404 when accessed directly")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 404")
            results.append(f"❌ Test 5 FAILED: Expected 404, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 5 FAILED: {e}")

    # Test 6: POST /api/petitions/{slug_of_pending}/sign - expect 404
    print(f"\n6️⃣ Testing POST /api/petitions/{test_slug}/sign - expect 404 for pending petition...")
    sign_data = {"name": "Sig", "email": "sig@test.com"}
    try:
        response = requests.post(f"{BACKEND_URL}/petitions/{test_slug}/sign", json=sign_data)
        if response.status_code == 404:
            print(f"   ✅ Status: {response.status_code} (correctly blocked signing pending petition)")
            results.append("✅ Test 6 PASSED: Cannot sign pending petition (404)")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 404")
            results.append(f"❌ Test 6 FAILED: Expected 404, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 6 FAILED: {e}")

    # Test 7: GET /api/petitions/{slug_of_pending}/approve?token=WRONG - expect 403
    print(f"\n7️⃣ Testing GET /api/petitions/{test_slug}/approve?token=WRONG - expect 403...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions/{test_slug}/approve?token=WRONG")
        if response.status_code == 403:
            print(f"   ✅ Status: {response.status_code} (correctly rejected wrong token)")
            results.append("✅ Test 7 PASSED: Wrong approval token returns 403")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 403")
            results.append(f"❌ Test 7 FAILED: Expected 403, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 7 FAILED: {e}")

    # Test 8: GET /api/petitions/{slug_of_pending}/approve?token={real_token} - expect 200 HTML
    print(f"\n8️⃣ Testing GET /api/petitions/{test_slug}/approve?token={test_token[:8]}... - expect 200 HTML...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions/{test_slug}/approve?token={test_token}")
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'text/html' in content_type:
                if 'approved' in response.text.lower():
                    print(f"   ✅ Status: {response.status_code}, Content-Type: {content_type}")
                    print(f"   ✅ HTML response contains 'approved'")
                    results.append("✅ Test 8 PASSED: Approval with correct token returns 200 HTML with 'approved'")
                else:
                    print(f"   ❌ HTML response doesn't contain 'approved'")
                    results.append("❌ Test 8 FAILED: HTML response doesn't mention 'approved'")
            else:
                print(f"   ❌ Content-Type: {content_type}, expected text/html")
                results.append(f"❌ Test 8 FAILED: Expected HTML, got {content_type}")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 200")
            results.append(f"❌ Test 8 FAILED: Expected 200, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 8 FAILED: {e}")

    # Test 9: GET /api/petitions/{slug_of_pending} - now expect 200 with status="approved"
    print(f"\n9️⃣ Testing GET /api/petitions/{test_slug} - now expect 200 with status='approved'...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions/{test_slug}")
        if response.status_code == 200:
            petition = response.json()
            if petition.get("status") == "approved":
                print(f"   ✅ Status: {response.status_code}, petition status: approved")
                results.append("✅ Test 9 PASSED: Approved petition now accessible with status='approved'")
            else:
                print(f"   ❌ Petition status: {petition.get('status')}, expected 'approved'")
                results.append(f"❌ Test 9 FAILED: Petition status is '{petition.get('status')}', expected 'approved'")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 200")
            results.append(f"❌ Test 9 FAILED: Expected 200, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 9 FAILED: {e}")

    # Test 10: POST /api/petitions/{slug_of_pending}/sign - expect 200 with signature_count=1
    print(f"\n🔟 Testing POST /api/petitions/{test_slug}/sign - expect 200 with signature_count=1...")
    try:
        response = requests.post(f"{BACKEND_URL}/petitions/{test_slug}/sign", json=sign_data)
        if response.status_code == 200:
            result = response.json()
            if result.get("signature_count") == 1:
                print(f"   ✅ Status: {response.status_code}, signature_count: 1")
                results.append("✅ Test 10 PASSED: Can sign approved petition, signature_count=1")
            else:
                print(f"   ❌ signature_count: {result.get('signature_count')}, expected 1")
                results.append(f"❌ Test 10 FAILED: signature_count is {result.get('signature_count')}, expected 1")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 200")
            results.append(f"❌ Test 10 FAILED: Expected 200, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 10 FAILED: {e}")

    # Test 11: Double-approval test - expect 200 with already: true logic
    print(f"\n1️⃣1️⃣ Testing double-approval - GET /api/petitions/{test_slug}/approve again...")
    try:
        response = requests.get(f"{BACKEND_URL}/petitions/{test_slug}/approve?token={test_token}")
        if response.status_code == 200:
            # Check if it's HTML or JSON response indicating already approved
            content_type = response.headers.get('content-type', '')
            if 'text/html' in content_type:
                print(f"   ✅ Status: {response.status_code}, Content-Type: {content_type}")
                print(f"   ✅ Double-approval handled (HTML response)")
                results.append("✅ Test 11 PASSED: Double-approval handled correctly")
            elif 'application/json' in content_type:
                result = response.json()
                if result.get("already"):
                    print(f"   ✅ Status: {response.status_code}, already: true")
                    results.append("✅ Test 11 PASSED: Double-approval returns already: true")
                else:
                    print(f"   ❌ JSON response doesn't have already: true")
                    results.append("❌ Test 11 FAILED: Double-approval doesn't indicate already approved")
            else:
                print(f"   ✅ Status: {response.status_code} (double-approval handled)")
                results.append("✅ Test 11 PASSED: Double-approval handled")
        else:
            print(f"   ❌ Status: {response.status_code}, expected 200")
            results.append(f"❌ Test 11 FAILED: Expected 200, got {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 11 FAILED: {e}")

    # Test 12: Create another pending petition, then reject it
    print(f"\n1️⃣2️⃣ Testing rejection workflow - create and reject petition...")
    reject_petition_data = {
        "title": "Test Rejection Flow",
        "creator_name": "Rejector",
        "creator_email": "reject@test.com",
        "category": "Environment",
        "target": "Government",
        "summary": "Testing rejection."
    }
    
    try:
        # Create petition to reject
        response = requests.post(f"{BACKEND_URL}/petitions", json=reject_petition_data)
        if response.status_code == 200:
            reject_petition = response.json()
            reject_slug = reject_petition.get("slug")
            reject_token = reject_petition.get("approval_token")
            print(f"   ✅ Created petition to reject: {reject_slug}")
            
            # Reject it
            response = requests.get(f"{BACKEND_URL}/petitions/{reject_slug}/reject?token={reject_token}")
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'text/html' in content_type and 'rejected' in response.text.lower():
                    print(f"   ✅ Rejection successful: {response.status_code}, HTML mentions 'rejected'")
                    
                    # Verify rejected petition returns 404
                    response = requests.get(f"{BACKEND_URL}/petitions/{reject_slug}")
                    if response.status_code == 404:
                        print(f"   ✅ Rejected petition correctly returns 404")
                        results.append("✅ Test 12 PASSED: Rejection workflow works, rejected petition returns 404")
                    else:
                        print(f"   ❌ Rejected petition returns {response.status_code}, expected 404")
                        results.append(f"❌ Test 12 FAILED: Rejected petition returns {response.status_code}, expected 404")
                else:
                    print(f"   ❌ Rejection response: {response.status_code}, Content-Type: {content_type}")
                    results.append("❌ Test 12 FAILED: Rejection didn't return proper HTML response")
            else:
                print(f"   ❌ Rejection failed: {response.status_code}")
                results.append(f"❌ Test 12 FAILED: Rejection returned {response.status_code}")
        else:
            print(f"   ❌ Failed to create petition to reject: {response.status_code}")
            results.append(f"❌ Test 12 FAILED: Couldn't create petition to reject")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(f"❌ Test 12 FAILED: {e}")

    # Test 13: Regression test existing endpoints
    print(f"\n1️⃣3️⃣ Testing regression - existing endpoints still work...")
    regression_tests = [
        ("GET /api/", "GET", f"{BACKEND_URL}/"),
        ("POST /api/contact", "POST", f"{BACKEND_URL}/contact", {
            "name": "Test User", "email": "test@example.com", "message": "Test message"
        }),
        ("POST /api/volunteer-application", "POST", f"{BACKEND_URL}/volunteer-application", {
            "name": "Test Volunteer", "email": "volunteer@test.com", "country": "USA", 
            "profession": "Developer", "mode": "Online"
        }),
        ("POST /api/ambassador-application", "POST", f"{BACKEND_URL}/ambassador-application", {
            "name": "Test Ambassador", "email": "ambassador@test.com", "track": "Public Diplomat"
        })
    ]
    
    regression_passed = 0
    for test_name, method, url, *data in regression_tests:
        try:
            if method == "GET":
                response = requests.get(url)
            else:
                response = requests.post(url, json=data[0] if data else {})
            
            if response.status_code in [200, 201]:
                print(f"   ✅ {test_name}: {response.status_code}")
                regression_passed += 1
            else:
                print(f"   ❌ {test_name}: {response.status_code}")
        except Exception as e:
            print(f"   ❌ {test_name}: Error - {e}")
    
    if regression_passed == len(regression_tests):
        results.append("✅ Test 13 PASSED: All regression tests passed")
    else:
        results.append(f"❌ Test 13 FAILED: {regression_passed}/{len(regression_tests)} regression tests passed")

    return results

def main():
    print("🚀 AGRF Petition Approval Workflow Testing")
    print(f"🔗 Backend URL: {BACKEND_URL}")
    print()
    
    results = test_petition_approval_workflow()
    
    print("\n" + "=" * 60)
    print("📋 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for r in results if r.startswith("✅"))
    failed = sum(1 for r in results if r.startswith("❌"))
    
    for result in results:
        print(result)
    
    print(f"\n📊 TOTAL: {passed} passed, {failed} failed out of {len(results)} tests")
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("❌ SOME TESTS FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())