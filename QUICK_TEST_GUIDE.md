# Quick Test Guide - Image System

## Prerequisites
1. Backend API running on `http://localhost:5000`
2. Frontend running on `http://localhost:5173` (or configured port)
3. Database migrations applied
4. `wwwroot/uploads` folder exists and is writable

## Quick Test Steps

### 1. Test Post Creation with Images

**Steps:**
```bash
# 1. Start backend
cd /home/momin-sheikh/BlogSystem
dotnet run --project Blog.API

# 2. In another terminal, start frontend
cd /home/momin-sheikh/BlogSystem/blog-frontend
npm run dev
```

**In Browser:**
1. Go to `http://localhost:5173/login`
2. Login as admin
3. Navigate to **Posts Management** → **Create Post**
4. Fill in:
   - Title: "Test Post with Images"
   - Category: Select any
   - Content: "Testing image upload"
5. Click the **upload area** or drag 2-3 image files
6. See **image previews** appear
7. Notice **first image has "Featured" badge**
8. Click **Create Post**
9. Should redirect to posts list with success message

### 2. Verify Images Saved

**Check Database:**
```sql
-- Check post created
SELECT * FROM Posts ORDER BY CreatedAt DESC LIMIT 1;

-- Check images saved
SELECT * FROM PostImages WHERE PostId = '<your-post-id>' ORDER BY DisplayOrder;
```

**Check File System:**
```bash
ls -la /home/momin-sheikh/BlogSystem/Blog.API/wwwroot/uploads/<post-id>/
# Should see your uploaded images
```

### 3. Test Public View

**Steps:**
1. Go to public posts page
2. Click on your test post
3. Should see:
   - Large main image at top
   - Thumbnail gallery below (if multiple images)
   - Featured badge on first thumbnail
4. Click different thumbnails → main image should change

### 4. Test Edit Mode

**Steps:**
1. Go back to **Posts Management**
2. Click **Edit** on your test post
3. Should see:
   - Existing images displayed
   - Delete button appears on hover
4. Add 1-2 more images
5. Click **Update Post**
6. Verify new images appear in public view

### 5. Test Delete Image

**Steps:**
1. Edit the post again
2. Hover over an existing image
3. Click the **X button**
4. Confirm deletion
5. Image should disappear
6. Check public view → image should be gone

## Expected Results

✅ **Create Flow:**
- Images preview before upload
- Post created with success message
- Images saved to database and disk

✅ **Display Flow:**
- Main image shows at full width
- Thumbnails clickable
- Smooth image switching

✅ **Edit Flow:**
- Existing images load
- Can add more images
- Can delete images
- Changes persist

## Common Issues & Solutions

### Issue: Images not uploading
**Check:**
- `wwwroot/uploads` folder exists
- Folder has write permissions
- FormData being sent correctly (check Network tab)

### Issue: Images not displaying
**Check:**
- API returns correct image URLs
- CORS configured if different domains
- Images accessible at: `http://localhost:5000/uploads/<postId>/<filename>`

### Issue: "Failed to load post" in edit mode
**Solution:**
- Backend endpoint GET `/api/posts/{id}` must exist
- Already added in this implementation ✅

### Issue: File size/type validation not working
**Check:**
- `appsettings.json` has correct configuration
- Client-side validation in `handleFileSelect()`

## Manual API Testing (Optional)

### Using cURL or Postman

**1. Create Post with Images:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <your-token>" \
  -F "title=API Test Post" \
  -F "content=Testing from API" \
  -F "categoryId=<category-guid>" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

**2. Get Post Images:**
```bash
curl http://localhost:5000/api/posts/<post-id>/images
```

**3. Upload More Images:**
```bash
curl -X POST http://localhost:5000/api/posts/<post-id>/images \
  -H "Authorization: Bearer <your-token>" \
  -F "files=@/path/to/image3.jpg"
```

**4. Delete Image:**
```bash
curl -X DELETE http://localhost:5000/api/posts/<post-id>/images/<image-id> \
  -H "Authorization: Bearer <your-token>"
```

## Success Checklist

- [ ] Backend builds without errors
- [ ] Frontend runs without console errors
- [ ] Can create post with images
- [ ] Images appear in post detail
- [ ] Can click thumbnails to switch images
- [ ] Can edit post and add more images
- [ ] Can delete images
- [ ] Featured badge shows on first image
- [ ] Validation works (file type, size)
- [ ] Files saved in correct directory structure

## Ready to Test!

Everything is implemented and ready. Just:
1. Start backend: `dotnet run --project Blog.API`
2. Start frontend: `npm run dev` (in blog-frontend folder)
3. Follow test steps above
4. Enjoy your working image system! 🎉
