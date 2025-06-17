import React, { useState } from 'react';
import { Product, ProductFilters } from '../../../types/product';
import { productService } from '../../../services/productService';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { ProductForm } from '../ProductForm/ProductForm';
import { usePermissions } from '../../../hooks/usePermissions';
import { useDebounce } from '../../../hooks/useDebounce';
import styles from './ProductCatalog.module.css';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

interface ProductCatalogProps {
  products?: Product[];
  loading?: boolean;
  onDelete?: (productId: string) => void;
  onEdit?: (product: Product) => void;
  onAdd?: () => void;
  onSearch?: (term: string) => void;
}

const Container = styled.div`
  padding: ${theme.spacing.lg};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
`;

const Th = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  background: ${theme.colors.neutral[50]};
  white-space: nowrap;

  &:first-child {
    border-top-left-radius: ${theme.borderRadius.lg};
  }

  &:last-child {
    border-top-right-radius: ${theme.borderRadius.lg};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const Td = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.neutral[100]};

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const ImageContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.neutral[100]};
  color: ${theme.colors.neutral[400]};
  font-size: ${theme.typography.fontSize.sm};
`;

interface ProductImageWithFallbackProps {
  src: string;
  alt: string;
}

const ProductImageWithFallback: React.FC<ProductImageWithFallbackProps> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <ImageContainer>
        <ImageFallback>
          📷
        </ImageFallback>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <ProductImage
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
      />
    </ImageContainer>
  );
};

const Price = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    
    > button {
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.typography.fontSize.xs};
    }
  }
`;

const Links = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  white-space: nowrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing.xs};
  }
`;

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  products = [], 
  loading = false,
  onDelete,
  onEdit,
  onAdd,
  onSearch
}) => {
  const { canEditProducts } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');

  console.log('ProductCatalog props:', { products, loading });

  if (loading) {
    return <div>Loading products...</div>;
  }

  const dummyProducts: Product[] = [
    {
      id: '1',
      name: 'Leather Backpack',
      description: 'High-quality leather backpack',
      price: 91.55,
      imageUrl: 'https://via.placeholder.com/300x200',
      category: 'Accessories',
      photoUrl: 'https://via.placeholder.com/60',
      photoPublicId: 'dummy-1',
      listingLink: 'https://etsy.com/listing/123',
      fulfillmentLink: 'https://supplier.com/product/123',
      fulfillmentMethod: 'Dropship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Scented Candle',
      description: 'Handmade scented candle',
      price: 17.20,
      imageUrl: 'https://via.placeholder.com/300x200',
      category: 'Home & Living',
      photoUrl: 'https://via.placeholder.com/60',
      photoPublicId: 'dummy-2',
      listingLink: 'https://etsy.com/listing/456',
      fulfillmentLink: 'https://supplier.com/product/456',
      fulfillmentMethod: 'Dropship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const displayProducts = products.length > 0 ? products : dummyProducts;
  console.log('Display products:', displayProducts);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  return (
    <Container>
      <Header>
        <SearchBar>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            fullWidth
          />
        </SearchBar>
        {canEditProducts && (
          <Button
            variant="primary"
            onClick={onAdd}
          >
            Add Product
          </Button>
        )}
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Photo</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Links</Th>
            {canEditProducts && <Th>Actions</Th>}
          </tr>
        </thead>
        <tbody>
          {displayProducts.map(product => (
            <tr key={product.id}>
              <Td>
                <ProductImageWithFallback src={product.photoUrl} alt={product.name} />
              </Td>
              <Td>
                <span style={{ 
                  fontWeight: 500,
                  color: theme.colors.text.primary,
                  display: 'block'
                }}>
                  {product.name}
                </span>
              </Td>
              <Td>
                <Price>${product.price.toFixed(2)}</Price>
              </Td>
              <Td>
                <Links>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(product.listingLink, '_blank')}
                  >
                    Listing
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(product.fulfillmentLink, '_blank')}
                  >
                    Fulfillment
                  </Button>
                </Links>
              </Td>
              {canEditProducts && (
                <Td>
                  <ActionButtons>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit?.(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete?.(product.id)}
                    >
                      Delete
                    </Button>
                  </ActionButtons>
                </Td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}; 