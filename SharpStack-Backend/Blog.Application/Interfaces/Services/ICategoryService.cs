using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blog.Application.DTOs.Categories;

namespace Blog.Application.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<Guid> CreateAsync(CreateCategoryRequest request);
        Task<IEnumerable<CategoryResponse>> GetAllAsync();
    }
}