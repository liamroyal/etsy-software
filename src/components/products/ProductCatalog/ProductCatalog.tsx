import React, { useState, useEffect, useCallback } from 'react';
import { Product, ProductFilters } from '../../../types/product';
import { productService } from '../../../services/productService';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { ProductForm } from '../ProductForm/ProductForm';
import { usePermissions } from '../../../hooks/usePermissions';
import { useDebounce } from '../../../hooks/useDebounce';
import styles from './ProductCatalog.module.css';

export const ProductCatalog: React.FC = () => {
  const { canEditProducts } = usePermissions();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    fulfillmentMethod: undefined,
    minPrice: undefined,
    maxPrice: undefined
  });

  const loadProducts = useCallback(async (searchValue: string) => {
    try {
      setLoading(true);
      const data = await productService.getProducts({
        ...filters,
        search: searchValue
      });
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Effect for search term changes
  useEffect(() => {
    loadProducts(debouncedSearchTerm);
  }, [debouncedSearchTerm, loadProducts]);

  // Effect for other filter changes
  useEffect(() => {
    if (!searchTerm) {
      loadProducts('');
    }
  }, [filters, loadProducts, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const handleAddSuccess = () => {
    setIsAddingProduct(false);
    loadProducts(searchTerm);
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    loadProducts(searchTerm);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (isAddingProduct || editingProduct) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <Button
            variant="secondary"
            onClick={() => editingProduct ? setEditingProduct(null) : setIsAddingProduct(false)}
          >
            Cancel
          </Button>
        </div>
        <ProductForm
          initialProduct={editingProduct || undefined}
          onSuccess={editingProduct ? handleEditSuccess : handleAddSuccess}
          onCancel={() => editingProduct ? setEditingProduct(null) : setIsAddingProduct(false)}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        {canEditProducts && (
          <Button
            variant="primary"
            onClick={() => setIsAddingProduct(true)}
          >
            Add Product
          </Button>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Photo</th>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Price</th>
            <th className={styles.headerCell}>Fulfillment Method</th>
            <th className={styles.headerCell}>Links</th>
            <th className={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className={styles.row}>
              <td className={styles.cell}>
                <img 
                  src={product.photoUrl} 
                  alt={product.name} 
                  className={styles.photo}
                />
              </td>
              <td className={styles.cell}>
                <span className={styles.productName}>{product.name}</span>
              </td>
              <td className={styles.cell}>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
              </td>
              <td className={styles.cell}>
                <span className={styles.method}>{product.fulfillmentMethod}</span>
              </td>
              <td className={styles.cell}>
                <div className={styles.links}>
                  <a 
                    href={product.listingLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.link}
                  >
                    Listing
                  </a>
                  {' | '}
                  <a 
                    href={product.fulfillmentLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.link}
                  >
                    Fulfillment
                  </a>
                </div>
              </td>
              <td className={styles.cell}>
                {canEditProducts && (
                  <div className={styles.actions}>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setEditingProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 