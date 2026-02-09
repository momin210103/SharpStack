# Search Functionality Guide

## Overview

The Blog API provides comprehensive search functionality for posts and categories with support for pagination, filtering, and role-based access control.

## Features

✅ **Search Posts and Categories** - Search across multiple content types  
✅ **Full-Text Search** - Searches in post titles and content  
✅ **Case-Insensitive** - Automatic case normalization  
✅ **Pagination** - Efficient data handling with metadata  
✅ **Content Preview** - Automatic truncation to 200 characters  
✅ **Category Filtering** - Filter posts by category  
✅ **Role-Based Search** - Public vs. Admin search capabilities  
✅ **Input Validation** - Minimum query length enforcement  

---

## Endpoints

### 1. Public Search (POST/GET)
**Endpoint:** `GET /api/search`

Search published posts accessible to all users.

**Query Parameters:**
- `q` (required, string, min 3 chars): Search query
- `page` (optional, int, default 1): Page number
- `pageSize` (optional, int, default 20): Results per page
- `categoryId` (optional, Guid): Filter by category

**Example:**
```http
GET /api/search?q=architecture&page=1&pageSize=10
```

**Response:**
```json
{
  "results": [
    {
      "type": "Post",
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Clean Architecture",
      "contentPreview": "Clean Architecture is a software design philosophy...",
      "categoryName": "Technology",
      "isPublished": true,
      "createdAt": "2026-02-06T10:00:00"
    }
  ],
  "totalCount": 15,
  "page": 1,
  "pageSize": 10,
  "totalPages": 2,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

### 2. Search Categories
**Endpoint:** `GET /api/search/categories`

Search categories by name.

**Query Parameters:**
- `q` (required, string, min 3 chars): Search query

**Example:**
```http
GET /api/search/categories?q=tech
```

**Response:**
```json
[
  {
    "type": "Category",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Technology"
  },
  {
    "type": "Category",
    "id": "987e6543-e21b-12d3-a456-426614174000",
    "title": "Tech Tutorials"
  }
]
```

---

### 3. Admin Advanced Search
**Endpoint:** `GET /api/search/admin` 🔐 **[Admin Only]**

Advanced search with ability to include unpublished posts.

**Query Parameters:**
- `q` (required, string, min 3 chars): Search query
- `page` (optional, int, default 1): Page number
- `pageSize` (optional, int, default 20): Results per page
- `categoryId` (optional, Guid): Filter by category
- `includeUnpublished` (optional, bool, default false): Include unpublished posts

**Authorization:** Bearer Token (Admin role required)

**Example:**
```http
GET /api/search/admin?q=draft&includeUnpublished=true
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## Search Behavior

### What Gets Searched

#### Posts
- **Title** (exact and partial matches)
- **Content** (full text search)
- Only **published** posts for public search
- Published AND unpublished for admin search (when `includeUnpublished=true`)

#### Categories
- **Name** field only

### Search Algorithm
- **Case-insensitive** string matching
- Uses `Contains` operation (substring match)
- No stemming or fuzzy matching
- Searches both title and content fields for posts

### Content Preview
- Post content is automatically truncated to **200 characters**
- Preserves word boundaries when possible
- Adds "..." if truncated

---

## Pagination

### Metadata Fields
Every paginated response includes:

```json
{
  "totalCount": 45,        // Total matching results
  "page": 1,               // Current page number
  "pageSize": 20,          // Items per page
  "totalPages": 3,         // Total pages available
  "hasNextPage": true,     // Can navigate forward
  "hasPreviousPage": false // Can navigate backward
}
```

### Navigation
```http
# First page
GET /api/search?q=test&page=1&pageSize=10

# Next page
GET /api/search?q=test&page=2&pageSize=10

# Last page
GET /api/search?q=test&page=3&pageSize=10
```

---

## Validation Rules

### Query Parameter Validation

| Parameter | Required | Min Length | Max Length | Default | Notes |
|-----------|----------|------------|------------|---------|-------|
| `q` | Yes | 3 | - | - | Search query |
| `page` | No | 1 | - | 1 | Must be positive |
| `pageSize` | No | 1 | 100 | 20 | Capped at 100 |
| `categoryId` | No | - | - | null | Valid Guid |
| `includeUnpublished` | No | - | - | false | Admin only |

### Error Responses

**Query Too Short:**
```json
{
  "statusCode": 400,
  "message": "Search query must be at least 3 characters long",
  "timestamp": "2026-02-06T10:30:00Z",
  "path": "/api/search"
}
```

**Missing Query:**
```json
{
  "statusCode": 400,
  "message": "One or more validation errors occurred.",
  "errors": {
    "q": ["The q field is required."]
  }
}
```

---

## Performance Considerations

### Current Implementation
- **In-memory filtering** using LINQ
- Suitable for small to medium datasets (< 10,000 posts)
- All posts loaded into memory for filtering

### Optimization Opportunities

For larger datasets, consider:

1. **SQL Full-Text Search**
   ```sql
   CREATE FULLTEXT INDEX ON Posts(Title, Content)
   ```

2. **Elasticsearch Integration**
   - Faster for large datasets
   - Advanced search features (fuzzy, stemming, synonyms)
   - Horizontal scalability

3. **Database-Level Filtering**
   - Move `Where` clause to SQL query
   - Reduces memory usage
   - Faster for large tables

---

## Example Usage Scenarios

### 1. Simple Blog Search
```http
GET /api/search?q=docker
```

### 2. Search with Category Filter
```http
# First, get category ID
GET /api/categories

# Then search within that category
GET /api/search?q=tutorial&categoryId=123e4567-e89b-12d3-a456-426614174000
```

### 3. Admin Review All Content
```http
GET /api/search/admin?q=review&includeUnpublished=true
Authorization: Bearer ADMIN_TOKEN
```

### 4. Paginated Search Results
```http
# Show 5 results per page
GET /api/search?q=programming&page=1&pageSize=5
```

---

## Integration with Other Features

### Works With
- ✅ **Authentication** - Admin search requires JWT token
- ✅ **Authorization** - Role-based access (Admin role)
- ✅ **Error Handling** - Uses GlobalExceptionHandlerMiddleware
- ✅ **Logging** - All searches logged via Serilog
- ✅ **Categories** - Filter by category ID
- ✅ **Posts** - Searches published/unpublished posts

### Example Flow
```
User → Search "architecture" 
     → Filter by "Technology" category
     → View paginated results
     → Click post to read full content
     → Add comment (authenticated users)
```

---

## Implementation Details

### Architecture

**Service Layer** (`SearchService.cs`)
- Business logic and validation
- Query processing
- Pagination calculation
- Content truncation

**Controller Layer** (`SearchController.cs`)
- HTTP endpoint exposure
- Request validation
- Authorization checks
- Response mapping

**DTOs**
- `SearchRequest` - Input parameters
- `SearchResponse` - Individual search result
- `PagedSearchResponse<T>` - Paginated response wrapper

### Code Example

```csharp
// Service usage
var results = await _searchService.SearchAsync(
    query: "docker",
    page: 1,
    pageSize: 20,
    categoryId: null
);

// Admin search
var adminResults = await _searchService.SearchAdminAsync(
    query: "draft",
    page: 1,
    pageSize: 10,
    categoryId: null,
    includeUnpublished: true
);
```

---

## Testing

### Test Scenarios

1. ✅ **Basic search** - Find posts by keyword
2. ✅ **Case-insensitive** - UPPERCASE, lowercase, MixedCase
3. ✅ **Content search** - Search in post content, not just title
4. ✅ **Pagination** - Navigate through pages
5. ✅ **Category filter** - Filter by category ID
6. ✅ **No results** - Empty result handling
7. ✅ **Validation** - Query length, empty query
8. ✅ **Content truncation** - 200 char limit
9. ✅ **Admin search** - Unpublished posts
10. ✅ **Category search** - Find categories by name

### Test File
See `Search.http` for comprehensive HTTP test cases.

---

## Future Enhancements

### Potential Improvements

1. **Advanced Filtering**
   - Date range filters
   - Author filter
   - Tag/keyword filters
   - Sort options (relevance, date, popularity)

2. **Search Features**
   - Highlighting matched terms
   - Search suggestions/autocomplete
   - Fuzzy matching
   - Synonym support
   - Search history

3. **Performance**
   - Database-level full-text search
   - Search result caching
   - Elasticsearch integration
   - Index optimization

4. **Analytics**
   - Popular search terms
   - No-result queries tracking
   - Search-to-click rates
   - User behavior analysis

---

## Troubleshooting

### No Results Found
- ✅ Check query length (min 3 characters)
- ✅ Verify posts are published (public search)
- ✅ Check spelling and try partial matches
- ✅ Try broader search terms

### Performance Issues
- ⚠️ Large dataset (> 10,000 posts)
  - Solution: Implement database-level search
- ⚠️ Complex queries taking too long
  - Solution: Add caching layer

### Authorization Errors
- 🔐 Admin search requires valid JWT token
- 🔐 Token must have "Admin" role claim
- 🔐 Check token expiration (60 min default)

---

## Summary

The search functionality provides:
- **Fast** in-memory search for small-medium datasets
- **Flexible** pagination and filtering
- **Secure** role-based access control
- **User-friendly** with validation and error handling
- **Scalable** architecture ready for enhancements

Perfect for blog systems, content management, and knowledge bases! 🚀
