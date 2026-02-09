# Serilog Configuration Guide

## ✅ Implementation Complete

### What Was Configured:

## 📊 Log Sinks (Destinations)

### 1. **Console Sink**
- **Format**: Plain text (human-readable)
- **Output Template**: `[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}`
- **Purpose**: Real-time monitoring during development

### 2. **File Sinks** (3 separate files by level)

#### INFO Level Logs
- **Path**: `logs/info/blog-api-YYYYMMDD.json`
- **Format**: Compact JSON (structured)
- **Includes**: Information, Warning, and Error level logs
- **Purpose**: General application activity

#### WARNING Level Logs
- **Path**: `logs/warning/blog-api-YYYYMMDD.json`
- **Format**: Compact JSON (structured)
- **Includes**: Warning and Error level logs
- **Purpose**: Issues that need attention

#### ERROR Level Logs
- **Path**: `logs/error/blog-api-YYYYMMDD.json`
- **Format**: Compact JSON (structured)
- **Includes**: Only Error and Fatal logs
- **Purpose**: Critical failures

---

## ⚙️ Configuration Details

### File Retention Policy
- **Retention Period**: 7 days
- **Auto-cleanup**: Files older than 7 days are automatically deleted
- **Rolling Interval**: Daily (new file each day)

### File Size Limits
- **Max File Size**: 50 MB per file
- **Behavior**: When limit reached, creates new numbered file
- **Example**: 
  - `blog-api-20260206.json` (fills to 50MB)
  - `blog-api-20260206_001.json` (next file)

### Log Levels by Environment

#### Development Environment
```json
{
  "Default": "Information",
  "Microsoft": "Warning",
  "Microsoft.EntityFrameworkCore": "Information",
  "Microsoft.AspNetCore": "Warning",
  "System": "Warning"
}
```
- Shows EF Core queries for debugging
- Reduces Microsoft framework noise

#### Production Environment
```json
{
  "Default": "Warning",
  "Microsoft": "Warning",
  "Microsoft.EntityFrameworkCore": "Error",
  "Microsoft.AspNetCore": "Warning",
  "System": "Warning"
}
```
- Only warnings and errors logged
- Reduces log volume in production
- EF Core only logs errors

---

## 🎨 Log Enrichment

Automatic enrichment with contextual information:

### Standard Enrichers
- **FromLogContext**: Request-scoped properties
- **WithMachineName**: Server/machine identifier
- **WithEnvironmentName**: Development/Production/Staging
- **WithThreadId**: Thread identifier for debugging

### Example Enriched Log Entry
```json
{
  "@t": "2026-02-06T11:32:39.3322831Z",
  "@l": "Warning",
  "@mt": "Bad Request: {Message}",
  "Message": "Comment content must be between 1 and 1000 characters",
  "MachineName": "momin-sheikh-H410M-H-V2",
  "EnvironmentName": "Development",
  "ThreadId": 18,
  "Application": "BlogAPI",
  "RequestId": "0HNJ5EDE3I853:00000001",
  "RequestPath": "/api/posts/786b0660-2145-48bb-b40f-16ec3aca3d48/comments",
  "ConnectionId": "0HNJ5EDE3I853"
}
```

---

## 📁 Directory Structure

```
Blog.API/
├── logs/
│   ├── info/
│   │   └── blog-api-20260206.json (all logs >= Info)
│   ├── warning/
│   │   └── blog-api-20260206.json (warnings + errors)
│   └── error/
│       └── blog-api-20260206.json (errors only)
```

---

## 🔍 JSON Log Format (Compact JSON)

### Fields in Log Entries:

| Field | Description | Example |
|-------|-------------|---------|
| `@t` | Timestamp (UTC) | `2026-02-06T11:32:39.3322831Z` |
| `@mt` | Message template | `Bad Request: {Message}` |
| `@l` | Log level | `Warning`, `Error`, `Information` |
| `@x` | Exception details | Full stack trace |
| `@tr` | Trace ID | `65f6a93035aba42663a70d11d899a3c1` |
| `@sp` | Span ID | `738f93772ad29071` |
| Custom properties | Application data | `RequestPath`, `UserId`, etc. |

### Why Compact JSON?
✅ Machine-readable for log aggregation tools  
✅ Easy to parse programmatically  
✅ Smaller file size than plain text  
✅ Structured query capability  
✅ Compatible with Seq, Elasticsearch, Splunk  

---

## 🎯 Usage Examples

### Reading Logs

#### View Latest Info Log
```bash
tail -f logs/info/blog-api-$(date +%Y%m%d).json | jq '.'
```

#### View Latest Warning
```bash
tail -1 logs/warning/blog-api-*.json | jq '.'
```

#### Search for Specific Error
```bash
cat logs/error/blog-api-*.json | jq 'select(.Message | contains("database"))'
```

#### Count Errors Today
```bash
cat logs/error/blog-api-$(date +%Y%m%d).json 2>/dev/null | wc -l
```

### Programmatic Access

```csharp
// In your code, log with context
_logger.LogInformation("User {UserId} created post {PostId}", userId, postId);

// With structured data
_logger.LogWarning("Invalid request from {IPAddress} for {Resource}", 
    ipAddress, requestPath);

// Errors with exception
_logger.LogError(exception, "Failed to process {Operation}", operationName);
```

---

## 📊 Log Levels Explained

### When to Use Each Level:

| Level | Use Case | Example |
|-------|----------|---------|
| **Verbose** | Detailed trace | "Entering method X with param Y" |
| **Debug** | Developer diagnostics | "Cache hit for key: user_123" |
| **Information** | General flow | "User logged in successfully" |
| **Warning** | Recoverable issues | "404 Not Found: Post with id '...' " |
| **Error** | Failures | "Database connection failed" |
| **Fatal** | App crashes | "Unhandled exception, shutting down" |

### Current Configuration:
- **Development**: Information and above (Info, Warning, Error)
- **Production**: Warning and above (Warning, Error only)

---

## 🔧 Configuration Files

### appsettings.json (Base Configuration)
```json
{
  "Serilog": {
    "Using": [ "Serilog.Sinks.Console", "Serilog.Sinks.File" ],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.EntityFrameworkCore": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      { 
        "Name": "File",
        "Args": {
          "path": "logs/info/blog-api-.json",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 7,
          "fileSizeLimitBytes": 52428800,
          "formatter": "Serilog.Formatting.Compact.CompactJsonFormatter"
        }
      }
    ],
    "Enrich": [ "FromLogContext", "WithMachineName", "WithEnvironmentName", "WithThreadId" ]
  }
}
```

### appsettings.Development.json (Override for Dev)
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Override": {
        "Microsoft.EntityFrameworkCore": "Information"
      }
    }
  }
}
```

### appsettings.Production.json (Override for Prod)
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Warning"
    }
  }
}
```

---

## 📦 NuGet Packages Installed

```xml
<PackageReference Include="Serilog.AspNetCore" Version="10.0.0" />
<PackageReference Include="Serilog.Sinks.File" Version="7.0.0" />
<PackageReference Include="Serilog.Enrichers.Environment" Version="3.0.1" />
<PackageReference Include="Serilog.Enrichers.Thread" Version="4.0.0" />
<PackageReference Include="Serilog.Settings.Configuration" Version="10.0.0" />
<PackageReference Include="Serilog.Formatting.Compact" Version="3.0.0" />
```

---

## 🚀 Performance Considerations

### File I/O
- **Async writes**: Non-blocking file operations
- **Buffering**: Reduces disk writes
- **Rolling**: Prevents single large files

### Production Optimizations
- **Warning level**: Reduces log volume by ~70%
- **Selective EF logging**: Only errors logged
- **File size limits**: Prevents disk space issues
- **Auto-cleanup**: 7-day retention saves space

---

## 🔍 Troubleshooting

### No Logs Appearing?

1. **Check permissions**
   ```bash
   ls -la logs/
   ```

2. **Verify configuration**
   ```bash
   cat appsettings.json | jq '.Serilog'
   ```

3. **Check log level**
   - Ensure events are at configured minimum level

### Logs Too Verbose?

1. **Increase minimum level** in appsettings
2. **Add overrides** for noisy namespaces
3. **Switch to Warning** level in production

### Finding Specific Logs?

Use `jq` for JSON queries:
```bash
# Find all 404 errors
cat logs/warning/*.json | jq 'select(.Message | contains("not found"))'

# Find logs for specific user
cat logs/info/*.json | jq 'select(.UserId == "user-123")'

# Find errors from specific source
cat logs/error/*.json | jq 'select(.SourceContext | contains("CommentService"))'
```

---

## 📈 Monitoring & Analysis

### Log Analysis Tools

**Compatible Tools:**
- **Seq**: Real-time log viewer (recommended)
- **Elasticsearch + Kibana**: Enterprise logging
- **Splunk**: Enterprise monitoring
- **Azure Application Insights**: Cloud monitoring
- **AWS CloudWatch**: AWS environments

### Setting up Seq (Optional)

```bash
# Run Seq in Docker
docker run -d -p 5341:80 -e ACCEPT_EULA=Y datalust/seq

# Add Seq sink to appsettings.json
{
  "WriteTo": [
    {
      "Name": "Seq",
      "Args": { "serverUrl": "http://localhost:5341" }
    }
  ]
}
```

---

## ✨ Benefits of This Configuration

### For Development
✅ Readable console output for debugging  
✅ Structured JSON logs for analysis  
✅ EF Core query logging enabled  
✅ Full stack traces available  

### For Production
✅ Reduced log volume (warnings only)  
✅ Automatic cleanup (7 days)  
✅ File size limits prevent disk issues  
✅ Machine-readable for aggregation  

### For Operations
✅ Separate files by severity  
✅ Easy to locate critical issues  
✅ Contextual information (machine, environment)  
✅ Trace IDs for distributed tracing  

---

## 🎯 Summary

**Configuration Highlights:**
- ✅ Console + File logging
- ✅ Separate files by level (Info, Warning, Error)
- ✅ JSON format (Compact JSON)
- ✅ 7-day retention
- ✅ 50 MB file size limit
- ✅ Environment-aware levels
- ✅ Rich enrichment (Machine, Environment, Thread)
- ✅ Reduced framework noise

**Result:** Production-ready logging infrastructure with structured logs, automatic cleanup, and environment-specific configurations! 🎉
