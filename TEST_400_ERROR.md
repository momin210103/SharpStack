# Debugging 400 Bad Request Error

## Changes Made to Fix

### 1. Fixed FormData Property Names (CRITICAL FIX)
**Problem:** Frontend was using lowercase property names, backend expects PascalCase

**Before:**
```javascript
postFormData.append('title', formData.title);
postFormData.append('content', formData.content);
postFormData.append('categoryId', formData.categoryId);
postFormData.append('images', file);
```

**After:**
```javascript
postFormData.append('Title', formData.title);
postFormData.append('Content', formData.content);
postFormData.append('CategoryId', formData.categoryId);
postFormData.append('Images', file);  // Must match List<IFormFile>? Images
```

### 2. Fixed Content-Type Header
**Problem:** Axios instance defaults to `application/json`, but FormData needs `multipart/form-data`

**Fix in postService.js:**
```javascript
createPost: async (postData) => {
  const config = postData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await axiosInstance.post("/posts", postData, config);
  return response.data;
}
```

### 3. Added Better Error Logging
**Added in PostForm.jsx:**
```javascript
console.log('FormData entries:');
for (let pair of postFormData.entries()) {
  console.log(pair[0] + ':', pair[1]);
}

console.error('Error response:', error.response?.data);
console.error('Error status:', error.response?.status);
```

## How to Debug if Still Getting 400

### Step 1: Check Browser Console
Look for the FormData entries log:
```
FormData entries:
Title: My Test Post
Content: This is content
CategoryId: 123e4567-e89b-12d3-a456-426614174000
Images: [File object]
Images: [File object]
```

### Step 2: Check Network Tab
1. Open DevTools → Network
2. Find the POST request to `/api/posts`
3. Check Request Headers:
   - Should have `Content-Type: multipart/form-data; boundary=...`
4. Check Request Payload:
   - Should show form data with all fields

### Step 3: Check Backend Response
Look at the error response in console:
```javascript
Error response: {
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": ["The Title field is required."],
    "CategoryId": ["The value '...' is not valid."]
  }
}
```

## Common 400 Error Causes

### 1. Invalid GUID Format
**Problem:** CategoryId is not a valid GUID
**Solution:** Ensure category selection returns proper GUID string

**Check:**
```javascript
console.log('CategoryId:', formData.categoryId);
console.log('Is valid GUID:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.categoryId));
```

### 2. Missing Required Fields
**Problem:** Title, Content, or CategoryId is empty
**Solution:** Frontend validation already checks this, but verify values

### 3. File Type Validation
**Problem:** Backend rejects invalid file types
**Solution:** Check backend logs for validation errors

### 4. Property Name Mismatch
**Problem:** FormData keys don't match C# property names
**Solution:** Use exact PascalCase names (already fixed)

## Backend Validation Rules

From `CreatePostRequest.cs`:
```csharp
public string Title { get; set; } = null!;        // Required
public string Content { get; set; } = null!;      // Required
public Guid CategoryId { get; set; }              // Required, valid GUID
public List<IFormFile>? Images { get; set; }     // Optional
```

From `PostService.cs`:
- Max images per post: Configurable (default 10)
- Max file size: Configurable (default 5MB)
- Allowed types: JPG, JPEG, PNG only

## Test Without Images First

If still having issues, test creating a post WITHOUT images:

```javascript
// In handleSubmit, create simple post first
const postFormData = new FormData();
postFormData.append('Title', 'Test Post');
postFormData.append('Content', 'Test Content');
postFormData.append('CategoryId', '<valid-guid>');
// Don't append any images

await postService.createPost(postFormData);
```

If this works, the issue is with image handling.
If this fails, the issue is with basic field validation.

## Verify Backend is Running

```bash
# Check if API is running
curl http://localhost:5000/api/posts/allposts

# Should return JSON array of posts (or empty array)
```

## Quick Test Script

Run this in browser console on the create post page:

```javascript
// Test FormData creation
const testFormData = new FormData();
testFormData.append('Title', 'Debug Test');
testFormData.append('Content', 'Debug Content');
testFormData.append('CategoryId', '123e4567-e89b-12d3-a456-426614174000'); // Use real GUID from your DB

// Test without images
fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: testFormData
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
```

## Expected Successful Response

When working correctly, you should see:
- Status: 200 OK
- Response: "Post created"
- Console: "Post created successfully" toast
- Redirect to: /admin/posts

## Files Modified for Fix

1. `/blog-frontend/src/pages/admin/PostForm.jsx`
   - Changed FormData keys to PascalCase
   - Added debug logging

2. `/blog-frontend/src/services/postService.js`
   - Added Content-Type header handling for FormData

## Now Try Again!

1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend dev server
3. Try creating a post with 1-2 images
4. Check console for FormData entries
5. Check Network tab for request details
6. If still failing, check error.response.data in console
