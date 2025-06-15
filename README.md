# Etsy Dropship Manager

A React-based application for managing Etsy dropshipping operations.

## Setup Instructions

1. Clone the repository
```bash
git clone [repository-url]
cd etsy-dropship-manager
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication and Firestore in your Firebase project
- Copy `firebase-config-example.js` to `firebase-config.js`
- Replace the placeholder values in `firebase-config.js` with your Firebase project credentials

4. Start the development server
```bash
npm start
```

Or build for production:
```bash
npm run build
npx serve -s build
```

## Features

- User authentication with role-based access control
- Product catalog management
- Order tracking
- User management (admin only)
- Responsive design

## Development

This project follows React best practices as documented in `docs/react-best-practices.md`. Key points:
- Uses CSS Modules for styling
- TypeScript for type safety
- Component-based architecture
- Custom hooks for business logic

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[Your chosen license]
