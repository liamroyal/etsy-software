import React, { useState, useEffect } from 'react';
import { ProductCatalog } from '../components/products/ProductCatalog/ProductCatalog';
import { Product, ProductFilters } from '../types/product';
import { productService } from '../services/productService';
import { ProductForm } from '../components/products/ProductForm/ProductForm';
import styled from 'styled-components';
import { theme } from '../styles/theme';


const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    width: 95%;
    padding: ${theme.spacing.lg};
  }
`;

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadProducts = async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please check your connection and try again.');
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (term: string) => {
    if (term && term.trim() !== '') {
      loadProducts({ search: term });
    } else {
      loadProducts(); // Reload all products if search is cleared
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
    loadProducts(); // Reload products to get the updated list
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  if (error) {
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        color: theme.colors.error[500],
        background: theme.colors.error[50],
        borderRadius: theme.borderRadius.md,
        margin: theme.spacing.md
      }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => loadProducts()}
          style={{
            marginTop: theme.spacing.md,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            background: theme.colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.sm,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading && !error) {
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        textAlign: 'center',
        color: theme.colors.text.secondary
      }}>
        Loading products...
      </div>
    );
  }

  return (
    <>
      <ProductCatalog
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAdd={handleAdd}
        onSearch={handleSearch}
        triggerInitialSearch={false}
      />

      {isFormOpen && (
        <Modal onClick={handleFormCancel}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ProductForm
              initialProduct={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}; 