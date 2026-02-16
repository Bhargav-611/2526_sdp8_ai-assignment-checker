# 🔧 Fix for 401 Unauthorized Error

## Problem
Getting `401 Unauthorized` error when student logs in and tries to view questions at `/api/facultyquesans/all`.

## Root Cause
The Spring Boot backend is still running with the **old security configuration**. The SecurityConfig.java changes need to be applied by restarting the backend.

## Solution

### Step 1: Stop the Current Backend (if running)
```powershell
# Find and kill the Java process
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
```

OR press `Ctrl+C` in the terminal where Spring Boot is running.

### Step 2: Restart the Backend
```powershell
# Navigate to Spring Boot directory
cd D:\Collage\Btech\sem6\AutoGrade\2526_sdp8_ai-assignment-checker\Auto-Grade-Springboot

# Clean and restart
./mvnw.cmd clean spring-boot:run
```

Wait for the message: `Started AutoGradeApplication in X seconds`

### Step 3: Verify Frontend is Running
```powershell
# If frontend is not running, start it
cd D:\Collage\Btech\sem6\AutoGrade\2526_sdp8_ai-assignment-checker\Auto-Grade-React
npm run dev
```

### Step 4: Test Again
1. Open http://localhost:5173
2. Login as student
3. You should now see the questions (no 401 error)

## Why This Happened
The SecurityConfig.java has these lines:
```java
.requestMatchers("/api/facultyquesans/**").permitAll()
.requestMatchers("/api/questions/**").permitAll()
```

These changes allow students to access questions without authentication issues, but Spring Boot must be restarted to load the new configuration.

## Verification
After restarting, the student login should work perfectly:
- ✅ Can login
- ✅ Can view questions
- ✅ Can upload answers
- ✅ No 401 errors

---

**TL;DR:** Restart Spring Boot backend to apply security configuration changes!
