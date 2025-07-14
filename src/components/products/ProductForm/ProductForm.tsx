import React, { useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { Product } from '../../../types/product';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import styles from './ProductForm.module.css';
import { productService } from '../../../services/productService';
import { uploadImage } from '../../../services/cloudinary';

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialProduct?: Product;
}

type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'photoUrl' | 'photoPublicId'>;

export const ProductForm: React.FC<ProductFormProps> = ({
  onSuccess,
  onCancel,
  initialProduct
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProduct?.photoUrl || null);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<ProductFormData>({
    name: {
      initialValue: initialProduct?.name || '',
      rules: [
        {
          validate: (value: string | undefined) => Boolean(value && value.length > 0),
          message: 'Name is required'
        }
      ]
    },
    price: {
      initialValue: initialProduct?.price || 0,
      rules: [
        {
          validate: (value: number) => value > 0,
          message: 'Price must be greater than 0'
        }
      ],
      transform: (value) => Number(value)
    },
    currency: {
      initialValue: initialProduct?.currency || 'USD',
      rules: [
        {
          validate: (value: string | undefined) => Boolean(value && value.length > 0),
          message: 'Currency is required'
        }
      ]
    },
    imageUrl: {
      initialValue: initialProduct?.imageUrl || '',
      rules: []
    },
    fulfillmentLink: {
      initialValue: initialProduct?.fulfillmentLink || '',
      rules: [
        {
          validate: (value: string | undefined) => Boolean(value && value.length > 0),
          message: 'Fulfillment link is required'
        }
      ]
    },
    listingLink: {
      initialValue: initialProduct?.listingLink || '',
      rules: [
        {
          validate: (value: string | undefined) => Boolean(value && value.length > 0),
          message: 'Listing link is required'
        }
      ]
    },
    fulfillmentMethod: {
      initialValue: initialProduct?.fulfillmentMethod || '',
      rules: [
        {
          validate: (value: string | undefined) => Boolean(value && value.length > 0),
          message: 'Fulfillment method is required'
        }
      ]
    },
    store: {
      initialValue: initialProduct?.store || '',
      rules: [
        {
          validate: (value: string | undefined) => Boolean(value && value.length > 0),
          message: 'Store name is required'
        }
      ]
    }
  }, {
    onSubmit: async (data) => {
      try {
        setIsUploading(true);
        let photoUrl = initialProduct?.photoUrl;
        let photoPublicId = initialProduct?.photoPublicId;

        // Only upload new photo if file is selected
        if (selectedFile) {
          const uploadResult = await uploadImage(selectedFile);
          photoUrl = uploadResult.url;
          photoPublicId = uploadResult.publicId;
          data.imageUrl = photoUrl; // Set the main product image URL
        }

        if (!photoUrl || !photoPublicId) {
          setUploadError('Please select a photo');
          return;
        }

        if (initialProduct?.id) {
          // Update existing product
          await productService.updateProduct(initialProduct.id, {
            ...data,
            photoUrl,
            photoPublicId
          });
        } else {
          // Add new product
          await productService.addProduct({
            ...data,
            photoUrl,
            photoPublicId
          });
        }

        onSuccess?.();
      } catch (error) {
        console.error('Error saving product:', error);
        setUploadError('Failed to save product');
      } finally {
        setIsUploading(false);
      }
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      // Validate file size (max 10MB - Cloudinary free tier limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <Input
          label="Product Name"
          name="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Store"
          name="store"
          value={values.store}
          onChange={(e) => handleChange('store', e.target.value)}
          error={errors.store}
          placeholder="Enter store name"
          required
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Price"
          name="price"
          type="number"
          value={values.price}
          onChange={(e) => handleChange('price', e.target.value)}
          error={errors.price}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="currency" className={styles.label}>Currency</label>
        <select
          id="currency"
          name="currency"
          value={values.currency}
          onChange={e => handleChange('currency', e.target.value)}
          className={styles.input}
          required
        >
          <option value="USD">USD ($)</option>
          <option value="AUD">AUD (A$)</option>
          <option value="NZD">NZD (NZ$)</option>
        </select>
        {errors.currency && <span className={styles.error}>{errors.currency}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Product Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
          required={!initialProduct}
        />
        {uploadError && <span className={styles.error}>{uploadError}</span>}
        {previewUrl && (
          <div className={styles.preview}>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.previewImage}
            />
          </div>
        )}
      </div>

      <div className={styles.field}>
        <Input
          label="Fulfillment Link"
          name="fulfillmentLink"
          value={values.fulfillmentLink}
          onChange={(e) => handleChange('fulfillmentLink', e.target.value)}
          error={errors.fulfillmentLink}
          required
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Listing Link"
          name="listingLink"
          value={values.listingLink}
          onChange={(e) => handleChange('listingLink', e.target.value)}
          error={errors.listingLink}
          required
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Fulfillment Method"
          name="fulfillmentMethod"
          value={values.fulfillmentMethod}
          onChange={(e) => handleChange('fulfillmentMethod', e.target.value)}
          error={errors.fulfillmentMethod}
          placeholder="Enter fulfillment method or instructions"
          required
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? 'Saving...' : initialProduct ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}; 