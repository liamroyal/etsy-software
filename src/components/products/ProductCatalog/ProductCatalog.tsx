import React, { useState, memo, useCallback, useEffect, useMemo } from 'react';
import { Product } from '../../../types/product';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { usePermissions } from '../../../hooks/usePermissions';
import { useDebounce } from '../../../hooks/useDebounce';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface ProductCatalogProps {
  products?: Product[];
  loading?: boolean;
  onDelete?: (productId: string) => void;
  onEdit?: (product: Product) => void;
  onAdd?: () => void;
  onSearch?: (term: string) => void;
}

interface ProductRowProps {
  product: Product;
  canEditProducts: boolean;
  isMobile: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
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

const SearchContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
  flex: 1;
  max-width: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: none;
    width: 100%;
  }
`;

const StoreSelect = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  background-color: white;
  min-width: 150px;
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${theme.colors.primary[100]};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  table-layout: fixed;

  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const Th = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  background: ${theme.colors.neutral[50]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    border-top-left-radius: ${theme.borderRadius.lg};
  }

  &:last-child {
    border-top-right-radius: ${theme.borderRadius.lg};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSize.xs};
  }
`;

const Td = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSize.xs};
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.neutral[100]};

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
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
    width: 32px;
    height: 32px;
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

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  white-space: nowrap;

  button {
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  }

  @media (max-width: 768px) {
    gap: ${theme.spacing.xs};

    button {
      padding: 4px 8px;
      font-size: 11px;
      min-height: 24px;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};

    button {
      padding: 4px 8px;
      font-size: 11px;
      min-height: 24px;
    }
  }

  @media (min-width: 769px) {
    flex-direction: row;
    button {
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
    }
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.lg};
`;

// Column width definitions
const columnWidths = {
  photo: '60px',
  name: '25%',
  price: '80px',
  store: '100px',
  fulfillmentMethod: '120px',
  links: '140px',
  actions: '120px'
};

const getStoreBadgeColors = (store: string | undefined) => {
  // Handle undefined/null store values
  if (!store) {
    return {
      backgroundColor: theme.colors.neutral[100],
      color: theme.colors.neutral[700]
    };
  }
  
  // Convert store name to lowercase for consistent matching
  const storeLower = store.toLowerCase();
  
  switch (storeLower) {
    case 'handmade goods':
      return {
        backgroundColor: theme.colors.success[100],
        color: theme.colors.success[700]
      };
    case 'cozy home':
      return {
        backgroundColor: theme.colors.warning[100],
        color: theme.colors.warning[700]
      };
    case 'vintage finds':
      return {
        backgroundColor: theme.colors.error[100],
        color: theme.colors.error[700]
      };
    case 'art & prints':
      return {
        backgroundColor: theme.colors.primary[100],
        color: theme.colors.primary[700]
      };
    case 'jewelry box':
      return {
        backgroundColor: theme.colors.neutral[100],
        color: theme.colors.neutral[700]
      };
    case 'garden & patio':
      return {
        backgroundColor: theme.colors.success[50],
        color: theme.colors.success[600]
      };
    case 'tech gadgets':
      return {
        backgroundColor: theme.colors.primary[50],
        color: theme.colors.primary[600]
      };
    default:
      // Generate a consistent color based on the store name
      const hash = store.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const colorOptions = [
        { backgroundColor: theme.colors.primary[100], color: theme.colors.primary[700] },
        { backgroundColor: theme.colors.success[100], color: theme.colors.success[700] },
        { backgroundColor: theme.colors.warning[100], color: theme.colors.warning[700] },
        { backgroundColor: theme.colors.error[100], color: theme.colors.error[700] },
        { backgroundColor: theme.colors.neutral[100], color: theme.colors.neutral[700] }
      ];
      return colorOptions[hash % colorOptions.length];
  }
};

const StoreBadge = styled.span<{ store: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  background-color: ${props => getStoreBadgeColors(props.store).backgroundColor};
  color: ${props => getStoreBadgeColors(props.store).color};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 2px 6px;
    font-size: 10px;
  }
`;

const getCurrencyFormatter = (currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  });

const ProductRow: React.FC<ProductRowProps> = memo(({ 
  product, 
  canEditProducts, 
  isMobile, 
  onEdit, 
  onDelete 
}) => (
  <tr key={product.id}>
    <Td>
      <ProductImageWithFallback 
        src={product.imageUrl || product.photoUrl || ''} 
        alt={product.name || 'Product'} 
      />
    </Td>
    <Td>{product.name || 'N/A'}</Td>
    <Td>{typeof product.price === 'number' ? getCurrencyFormatter(product.currency).format(product.price) : getCurrencyFormatter(product.currency).format(0)}</Td>
    <Td>
      <StoreBadge store={product.store}>
        {product.store || 'Unknown'}
      </StoreBadge>
    </Td>
    <Td>{product.fulfillmentMethod || 'N/A'}</Td>
    <Td>
      <Links>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => product.listingLink && window.open(product.listingLink, '_blank')}
          disabled={!product.listingLink}
        >
          View Listing
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => product.fulfillmentLink && window.open(product.fulfillmentLink, '_blank')}
          disabled={!product.fulfillmentLink}
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
));

export const ProductCatalog: React.FC<ProductCatalogProps & { triggerInitialSearch?: boolean }> = ({
  products = [],
  loading = false,
  onDelete,
  onEdit,
  onAdd,
  onSearch,
  triggerInitialSearch = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { canEditProducts } = usePermissions();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Get unique stores from products
  const availableStores = useMemo(() => {
    const stores = Array.from(new Set(products.map(product => product.store)));
    return stores.sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Filter products based on selected store
  const filteredProducts = useMemo(() => {
    if (!selectedStore) return products;
    return products.filter(product => product.store === selectedStore);
  }, [products, selectedStore]);

  useEffect(() => {
    if (onSearch && (triggerInitialSearch || debouncedSearchTerm)) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, triggerInitialSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStoreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(e.target.value);
  }, []);

  const handleShowAll = useCallback(() => {
    setSearchTerm('');
    setSelectedStore('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <Container>
      <Header>
        <SearchContainer>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <StoreSelect value={selectedStore} onChange={handleStoreChange}>
            <option value="">All Stores</option>
            {availableStores.map(store => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </StoreSelect>
          <Button variant="secondary" onClick={handleShowAll}>
            Show All
          </Button>
        </SearchContainer>
        {canEditProducts && (
          <Button variant="primary" onClick={onAdd}>
            Add Product
          </Button>
        )}
      </Header>

      {loading ? (
        <LoadingOverlay>Loading products...</LoadingOverlay>
      ) : products.length === 0 ? (
        <LoadingOverlay>No products found</LoadingOverlay>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th style={{ width: columnWidths.photo }}>Photo</Th>
              <Th style={{ width: columnWidths.name }}>Name</Th>
              <Th style={{ width: columnWidths.price }}>Price</Th>
              <Th style={{ width: columnWidths.store }}>Store</Th>
              <Th style={{ width: columnWidths.fulfillmentMethod }}>Fulfillment</Th>
              <Th style={{ width: columnWidths.links }}>Links</Th>
              {canEditProducts && <Th style={{ width: columnWidths.actions }}>Actions</Th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                canEditProducts={canEditProducts}
                isMobile={isMobile}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default memo(ProductCatalog); 