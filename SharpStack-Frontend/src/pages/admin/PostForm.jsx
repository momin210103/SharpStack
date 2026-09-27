import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postService from '../../services/postService';
import categoryService from '../../services/categoryService';
import toast from 'react-hot-toast';
import {
  FiSave,
  FiArrowLeft,
  FiImage,
  FiX,
  FiUploadCloud,
  FiCheck,
  FiStar,
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../styles/quill-custom.css';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
      fetchExistingImages();
    } else {
      setInitialLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchPost = async () => {
    try {
      const posts = await postService.getAllPosts();
      const post = posts.find((p) => String(p.id) === String(id));
      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          categoryId: post.categoryId || '',
        });
      }
    } catch (error) {
      console.error('Failed to load post', error);
      toast.error('Failed to load post');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchExistingImages = async () => {
    if (!id) return;
    try {
      const response = await postService.getPostImages(id);
      setExistingImages(response.images || response || []);
    } catch (error) {
      console.error('Failed to load existing images:', error);
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

  const processFiles = (files) => {
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isValidFormat = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      if (!isImage || !isValidFormat) {
        toast.error(`${file.name} is not a valid format. Only JPG, JPEG, and PNG are allowed.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const totalCount = selectedFiles.length + validFiles.length;
      if (totalCount > 10) {
        toast.error('Maximum 10 images allowed. Excess files were ignored.');
        validFiles.splice(10 - selectedFiles.length);
      }

      setSelectedFiles((prev) => [...prev, ...validFiles]);

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
      console.error('Failed to delete image', error);
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

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e, shouldPublish = false) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Post Title is required');
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    if (!textContent.trim()) {
      toast.error('Post Content is required');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await postService.updatePost(id, formData);

        if (selectedFiles.length > 0) {
          await handleUploadImages(id);
        }

        if (shouldPublish) {
          try {
            await postService.publishPost(id);
          } catch (err) {
            console.error('Publish error:', err);
          }
        }

        toast.success(shouldPublish ? 'Post updated and published' : 'Post updated successfully');
      } else {
        const postFormData = new FormData();
        postFormData.append('Title', formData.title);
        postFormData.append('Content', formData.content);
        postFormData.append('CategoryId', formData.categoryId);

        if (shouldPublish) {
          postFormData.append('IsPublished', 'true');
        }

        selectedFiles.forEach((file) => {
          postFormData.append('Images', file);
        });

        const created = await postService.createPost(postFormData);
        const createdId = created?.id || created?.postId;

        if (shouldPublish && createdId) {
          try {
            await postService.publishPost(createdId);
          } catch (err) {
            console.error('Publish error:', err);
          }
        }

        toast.success(shouldPublish ? 'Post published successfully' : 'Post saved as draft');
      }

      navigate('/admin/posts');
    } catch (error) {
      console.error('Post submission error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        (isEditMode ? 'Failed to update post' : 'Failed to create post');
      toast.error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <LoadingSpinner size="large" />
        <p className="font-mono text-xs text-[var(--color-text-muted)]">Loading post editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* PAGE HEADER */}
      <div className="pb-6 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-3 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" size={13} />
          <span>← Back to Posts</span>
        </button>
        <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-2">
          — {isEditMode ? 'EDIT WORKFLOW' : 'AUTHORING'}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-text)] tracking-tight">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="font-serif text-base text-[var(--color-text-muted)] mt-2 leading-relaxed">
          {isEditMode
            ? 'Update and manage your article content and details.'
            : 'Write and publish a new article to SharpStack.'}
        </p>
      </div>

      {/* MAIN FORM CARD */}
      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-6 sm:p-8 space-y-7 shadow-xs"
      >
        {/* Post Title */}
        <div>
          <label htmlFor="title" className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2">
            Post Title <span className="text-[var(--color-primary)]">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging post title..."
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] font-serif text-base placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] outline-none transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2">
            Category <span className="text-[var(--color-primary)]">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] font-mono text-xs focus:border-[var(--color-primary)] outline-none transition-colors cursor-pointer"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label htmlFor="content" className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2">
            Content <span className="text-[var(--color-primary)]">*</span>
          </label>
          <div className="border border-[var(--color-border)] rounded-[4px] overflow-hidden focus-within:border-[var(--color-primary)] bg-[var(--color-surface-secondary)] transition-colors">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Write your article content..."
              style={{ minHeight: '380px' }}
            />
          </div>
          <p className="font-mono text-xs text-[var(--color-text-muted)] mt-2">
            Markdown formatting, code blocks, lists, and embeds supported.
          </p>
        </div>

        {/* Images Upload Section */}
        <div className="pt-2">
          <label className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2">
            Images (Optional)
          </label>

          {/* Existing Images in Edit Mode */}
          {isEditMode && existingImages.length > 0 && (
            <div className="mb-5 p-4 bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)] rounded-[4px]">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-3">
                // EXISTING ARTICLE IMAGES:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {existingImages.map((image, idx) => (
                  <div key={image.id} className="relative rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden group">
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.fileName || 'Uploaded'}
                      className="w-full h-28 object-cover"
                      onError={(e) => {
                        e.target.alt = 'Failed to load';
                      }}
                    />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-[var(--color-primary)] text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[2px] shadow-xs flex items-center gap-1">
                        <FiStar size={10} />
                        Featured
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(image.id)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                      title="Delete image"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[4px] p-8 text-center transition-all ${
              isDragging
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-[1.005]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface-secondary)]/30'
            }`}
          >
            <input
              type="file"
              id="images"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="hidden"
              disabled={loading || uploadingImages}
            />
            <label htmlFor="images" className="cursor-pointer flex flex-col items-center select-none">
              <div className="w-12 h-12 rounded-[4px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                <FiUploadCloud size={24} />
              </div>
              <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
                Click to upload or drag and drop
              </span>
              <span className="font-mono text-[11px] text-[var(--color-text-muted)] mt-1">
                JPG, JPEG or PNG (Maximum 5MB per image, up to 10 images)
              </span>
            </label>
          </div>

          {/* Selected File Previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4 p-4 bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)] rounded-[4px]">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-3">
                // SELECTED IMAGES TO UPLOAD ({selectedFiles.length}):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-[var(--color-primary)] text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[2px] shadow-xs flex items-center gap-1">
                        <FiStar size={10} />
                        Featured
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <FiX size={14} />
                    </button>
                    <div className="p-2 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-muted)] truncate">
                      <p className="truncate text-[var(--color-text)]">{selectedFiles[index]?.name}</p>
                      <p>{formatFileSize(selectedFiles[index]?.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FORM ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--color-border)] font-mono text-xs">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            disabled={loading || uploadingImages}
            className="px-4 py-2.5 rounded-[3px] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {/* Save Draft */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading || uploadingImages}
              className="px-4 py-2.5 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text)] font-semibold transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>

            {/* Publish Post / Update Post */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading || uploadingImages}
              className="px-5 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white font-semibold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading || uploadingImages ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                  <span>{uploadingImages ? 'Uploading...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <FiCheck size={14} />
                  <span>{isEditMode ? 'Update Post' : 'Publish Post'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
