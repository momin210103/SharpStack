import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postService from '../../services/postService';
import categoryService from '../../services/categoryService';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiImage, FiX, FiUpload } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../styles/quill-custom.css';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    } else {
      setInitialLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchPost = async () => {
    try {
      const posts = await postService.getAllPosts();
      const post = posts.find((p) => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          categoryId: post.categoryId,
          imageUrl: post.imageUrl,
        });
      }
    } catch (error) {
      toast.error('Failed to load post');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidFormat = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      if (!isImage || !isValidFormat) {
        toast.error(`${file.name} is not a valid image format. Only JPG, JPEG, and PNG are allowed.`);
        return false;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);

      // Create preview URLs
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await postService.deleteImage(id, imageId);
      toast.success('Image deleted successfully');
      fetchExistingImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleUploadImages = async (postId) => {
    if (selectedFiles.length === 0) return;

    try {
      setUploadingImages(true);
      await postService.uploadImages(postId, selectedFiles);
      toast.success(`${selectedFiles.length} image(s) uploaded successfully`);
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Image upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload images';
      toast.error(errorMessage);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    // Check if content is empty (handling HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    if (!textContent.trim()) {
      toast.error('Content is required');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Category is required');
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // Update post
        await postService.updatePost(id, formData);

        // Upload new images if any
        if (selectedFiles.length > 0) {
          await handleUploadImages(id);
        }

        toast.success('Post updated successfully');
      } else {
        // Create post with images
        const postFormData = new FormData();
        postFormData.append('Title', formData.title);
        postFormData.append('Content', formData.content);
        postFormData.append('CategoryId', formData.categoryId);

        // Append images - must match property name "Images"
        selectedFiles.forEach((file) => {
          postFormData.append('Images', file);
        });

        // Debug log
        console.log('FormData entries:');
        for (let pair of postFormData.entries()) {
          console.log(pair[0] + ':', pair[1]);
        }

        await postService.createPost(postFormData);
        toast.success('Post created successfully');
      }

      navigate('/admin/posts');
    } catch (error) {
      console.error('Post submission error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.title ||
        error.response?.data?.errors ||
        error.message ||
        (isEditMode ? 'Failed to update post' : 'Failed to create post');
      toast.error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/posts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft />
          Back to Posts
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter post title"
            maxLength={200}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            className="bg-white"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                ['clean']
              ]
            }}
            formats={[
              'header', 'font', 'size',
              'bold', 'italic', 'underline', 'strike',
              'color', 'background',
              'script',
              'list', 'bullet', 'indent',
              'direction', 'align',
              'blockquote', 'code-block',
              'link', 'image', 'video'
            ]}
            placeholder="Write your post content..."
            style={{ minHeight: '400px' }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Rich text content with formatting
          </p>
        </div>

        {/* Images Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiImage className="inline mr-2" />
            Images (Optional - Max 10 images, 5MB each)
          </label>

          {/* Existing Images (Edit Mode) */}
          {isEditMode && existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.fileName}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        console.error('Failed to load image:', e.target.src);
                        e.target.alt = 'Failed to load';
                      }}
                    />
                    {image.isFeatured && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              id="images"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="hidden"
              disabled={loading}
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center"
            >
              <FiUpload className="text-4xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500 mt-1">
                JPG, JPEG or PNG (Max 5MB each)
              </span>
            </label>
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Selected Images ({selectedFiles.length}):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-primary-200"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                      {selectedFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {loading || uploadingImages ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {uploadingImages ? 'Uploading Images...' : isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave />
                {isEditMode ? 'Update Post' : 'Create Post'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="btn-secondary"
            disabled={loading || uploadingImages}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
