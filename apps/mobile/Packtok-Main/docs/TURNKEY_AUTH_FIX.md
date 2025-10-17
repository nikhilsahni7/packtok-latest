# Turnkey Form Authentication Fix

## Issue Identified

The turnkey project form was returning 401 (Unauthorized) errors when submitting. The logs showed:

- Authorization header was present with Bearer token
- Status code: 401
- Multiple retry attempts failing

## Root Cause

The form submission was failing authentication because:

1. The token might have expired or been invalid
2. No auth check was performed before allowing form access
3. Error messages weren't clear about authentication issues

## Changes Made

### 1. Enhanced API Logging (`/lib/api.ts`)

Added console logs to track token usage:

```typescript
console.log("🔑 Token added to request:", config.url);
console.log("⚠️ No token found for request:", config.url);
```

This helps debug token issues in development.

### 2. Improved Hook Error Handling (`/hooks/useTurnkeyProject.ts`)

Added detailed error logging and better error propagation:

```typescript
console.log("📤 Submitting turnkey project form...");
console.log("✅ Turnkey project submitted successfully:", response);
console.error("❌ Turnkey project submission failed:", {
  status: error.response?.status,
  message: error.response?.data?.message || error.message,
  data: error.response?.data,
});
```

### 3. Authentication Check on Form Mount (`/app/services/turnkey-projects-form.tsx`)

Added useEffect to verify user is authenticated before showing form:

```typescript
useEffect(() => {
  const checkAuth = async () => {
    const token = await TokenStorage.getAccessToken();
    if (!token) {
      Alert.alert(
        "Authentication Required",
        "Please login to submit a turnkey project inquiry.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/login"),
          },
          {
            text: "Cancel",
            onPress: () => router.back(),
            style: "cancel",
          },
        ]
      );
    }
  };
  checkAuth();
}, []);
```

### 4. Better Form Error Messages

Enhanced error handling with specific status code checks:

```typescript
if (error?.response?.status === 401) {
  message = "Authentication failed. Please login again.";
} else if (error?.response?.status === 400) {
  message = error?.response?.data?.message || "Invalid form data.";
}
```

## Testing Steps

### To Test the Fix:

1. **Check if user is logged in:**

   ```
   - Open app
   - Check if you see user data in settings
   - If not, login first
   ```

2. **Navigate to form:**

   ```
   - Go to Services > Turnkey Projects
   - Click "Fill the Form"
   - Form should open (if authenticated)
   - Or see alert to login (if not authenticated)
   ```

3. **Fill and submit:**

   ```
   - Fill all required fields
   - Watch console logs for:
     🔑 Token added to request
     📤 Submitting turnkey project form
     ✅ Success message
   ```

4. **Check console for errors:**
   ```
   - If 401: Token expired, need to login again
   - If 400: Check form data validation
   - If 500: Backend error
   ```

## Debugging Commands

### Check if token exists:

```javascript
import { TokenStorage } from "./lib/api";

const token = await TokenStorage.getAccessToken();
console.log("Token:", token ? "EXISTS" : "MISSING");
```

### Manually test API:

```javascript
import api from "./lib/api";

try {
  const response = await api.get("/api/v1/auth/me");
  console.log("Auth check:", response.data);
} catch (error) {
  console.error("Auth failed:", error.response?.status);
}
```

## Common Issues & Solutions

### Issue: 401 Unauthorized

**Solution:** User needs to login again

```
- Navigate to /login
- Enter credentials
- Token will be refreshed
```

### Issue: Token expired

**Solution:** Automatic refresh handled by interceptor

```
- The api.ts interceptor automatically tries to refresh
- If refresh fails, user needs to login
```

### Issue: No token at all

**Solution:** User was never authenticated

```
- Check onboarding flow completed
- Verify login was successful
- Check SecureStore permissions
```

## Backend Requirements

The backend must:

1. ✅ Accept Bearer token in Authorization header
2. ✅ Return user data with token
3. ✅ Provide refresh token endpoint
4. ✅ Return proper error messages for 401/400/500

## Next Steps

If issues persist:

1. **Check backend logs** to see what error it's returning
2. **Verify token format** matches backend expectations
3. **Test with Postman** using the same token
4. **Check CORS settings** on backend
5. **Verify API endpoint** is correct: `/api/v1/services/turnkey-project`

## Monitoring

Watch these console logs:

- ✅ `🔑 Token added to request` - Token is present
- ⚠️ `⚠️ No token found` - User not authenticated
- ✅ `📤 Submitting turnkey project form` - Form submission started
- ✅ `✅ Turnkey project submitted successfully` - Success!
- ❌ `❌ Turnkey project submission failed` - Check error details
