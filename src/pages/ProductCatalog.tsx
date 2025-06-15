import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Button } from '../components/common/Button/Button';
import { theme } from '../styles/theme';

const productStyles = {
  container: {
    maxWidth: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing['2xl'],
    flexWrap: 'wrap' as const,
    gap: theme.spacing.lg
  },
  headerContent: {
    flex: 1,
    minWidth: '200px'
  },
  title: {
    margin: 0,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.tight
  },
  subtitle: {
    margin: `${theme.spacing.sm} 0 0 0`,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap' as const
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: theme.spacing.xl
  },
  productCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,
    overflow: 'hidden',
    transition: theme.transitions.normal
  },
  productCardHover: {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)'
  },
  productImage: {
    width: '100%',
    height: '200px',
    backgroundColor: theme.colors.neutral[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text.tertiary
  },
  productContent: {
    padding: theme.spacing.xl
  },
  productTitle: {
    margin: 0,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.tight
  },
  productDescription: {
    margin: `${theme.spacing.sm} 0`,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.relaxed
  },
  productPrice: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    margin: `${theme.spacing.md} 0`,
    fontFamily: theme.typography.fontFamily.sans
  },
  productActions: {
    display: 'flex',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: theme.spacing['3xl'],
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`
  },
  emptyIcon: {
    fontSize: theme.typography.fontSize['4xl'],
    marginBottom: theme.spacing.lg
  },
  emptyTitle: {
    margin: 0,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans
  },
  emptyDescription: {
    margin: `${theme.spacing.sm} 0 ${theme.spacing.xl} 0`,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  }
};

const ProductCatalog: React.FC = () => {
  const permissions = usePermissions();
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

  // Mock product data
  const products = [
    {
      id: '1',
      name: 'Vintage Ceramic Mug',
      description: 'Handcrafted ceramic mug with vintage design, perfect for coffee lovers.',
      price: '$24.99',
      image: '☕'
    },
    {
      id: '2',
      name: 'Boho Wall Hanging',
      description: 'Beautiful macrame wall hanging to add bohemian style to any room.',
      price: '$39.99',
      image: '🪴'
    },
    {
      id: '3',
      name: 'Artisan Candle Set',
      description: 'Set of 3 hand-poured soy candles with natural essential oils.',
      price: '$45.99',
      image: '🕯️'
    },
    {
      id: '4',
      name: 'Leather Journal',
      description: 'Premium leather-bound journal with handmade paper pages.',
      price: '$32.99',
      image: '📖'
    }
  ];

  const handleEdit = (productId: string) => {
    console.log('Edit product:', productId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (productId: string) => {
    console.log('Delete product:', productId);
    // TODO: Implement delete functionality
  };

  const handleAddProduct = () => {
    console.log('Add new product');
    // TODO: Implement add product functionality
  };

  return (
    <div style={productStyles.container}>
      {/* Header */}
      <div style={productStyles.header}>
        <div style={productStyles.headerContent}>
          <h1 style={productStyles.title}>🛍️ Product Catalog</h1>
          <p style={productStyles.subtitle}>
            Manage your dropshipping product inventory
          </p>
        </div>
        
        {permissions.canEditProducts && (
          <div style={productStyles.headerActions}>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => console.log('Import products')}
            >
              Import Products
            </Button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div style={productStyles.productGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                ...productStyles.productCard,
                ...(hoveredCard === product.id ? productStyles.productCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={productStyles.productImage}>
                {product.image}
              </div>
              
              <div style={productStyles.productContent}>
                <h3 style={productStyles.productTitle}>{product.name}</h3>
                <p style={productStyles.productDescription}>{product.description}</p>
                <div style={productStyles.productPrice}>{product.price}</div>
                
                <div style={productStyles.productActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => console.log('View product:', product.id)}
                  >
                    View Details
                  </Button>
                  
                  {permissions.canEditProducts && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product.id)}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={productStyles.emptyState}>
          <div style={productStyles.emptyIcon}>📦</div>
          <h2 style={productStyles.emptyTitle}>No Products Yet</h2>
          <p style={productStyles.emptyDescription}>
            Start building your catalog by adding your first product.
          </p>
          {permissions.canEditProducts && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddProduct}
            >
              Add Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog; 