import app from './app';
import { logger } from './utils/logger';
import { prisma } from './config/database';
import { redis } from './config/redis';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting server...');
    // Test database connection
    await prisma.$connect();
    console.log('Database connected');
    logger.info('✅ Database connected successfully');

    // Test Redis connection
    await redis.ping();
    console.log('Redis connected');
    logger.info('✅ Redis connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
    });

    // Keep server alive
    server.on('error', (error) => {
      console.error('Server error:', error);
      logger.error('Server error:', error);
    });

    console.log('Server started successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

startServer();
