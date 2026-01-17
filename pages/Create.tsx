import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Upload, X, Loader2 } from 'lucide-react';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const { addBoard } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [humanName, setHumanName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ id: string; url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...filesArray];
      setSelectedFiles(newFiles);

      // Generate previews
      const newPreviews = filesArray.map(file => ({
        id: generateId(),
        url: URL.createObjectURL(file)
      }));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls(prev => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[indexToRemove].url);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanName || selectedFiles.length === 0) return;

    setIsSubmitting(true);

    // Simulate processing delay for "App-like" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const newBoard = {
      id: generateId(),
      humanName,
      description,
      createdAt: Date.now(),
      images: previewUrls.map((preview, index) => ({
        id: preview.id,
        url: preview.url,
        file: selectedFiles[index]
      }))
    };

    addBoard(newBoard);
    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="page-padding" style={{ maxWidth: '32rem', margin: '0 auto' }}>
      <h1 className="page-title">Create New</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="form-group">
          <label className="form-label">Human Name <span style={{color: '#ef4444'}}>*</span></label>
          <input
            type="text"
            value={humanName}
            onChange={(e) => setHumanName(e.target.value)}
            className="form-input"
            placeholder="e.g. Alice Wonderland"
            required
          />
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label className="form-label">Description <span style={{color: '#6b7280'}}>(Optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            style={{ height: '6rem', resize: 'none' }}
            placeholder="Add some details..."
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">Upload Images <span style={{color: '#ef4444'}}>*</span></label>
          
          <div className="upload-grid">
            {previewUrls.map((preview, index) => (
              <div key={preview.id} className="preview-box group">
                <img src={preview.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-btn"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="upload-btn"
            >
              <Upload size={24} />
              <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Add</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Original quality preserved. No compression.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !humanName || selectedFiles.length === 0}
          className={`btn-submit ${isSubmitting || !humanName || selectedFiles.length === 0 ? 'disabled' : 'active'}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Creating...
            </>
          ) : (
            'Create Board'
          )}
        </button>
      </form>
    </div>
  );
};
